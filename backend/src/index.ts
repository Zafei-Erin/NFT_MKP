import { PrismaClient } from "@prisma/client";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, GET, DELETE, OPTIONS"
  );
  next();
});

app.use(errorHandler);

app.get("/test", (req, res) => {
  res.status(200).json({ message: "API is working 11" });
});

const GetNFTRequest = z.object({
  offset: z.coerce.number().optional().default(10),
  skip: z.coerce.number().optional().default(0),
  orderBy: z.coerce.string().optional().default("tokenId"),
  order: z.coerce.string().optional().default("desc"),
  filterBy: z.coerce.string().optional(),
  filterBool: z.coerce.boolean().optional().default(false),
});

type GetNFTRequest = z.infer<typeof GetNFTRequest>;

// get all nfts, to display on home page
app.get("/nfts", async (req, res, next) => {
  const queryWithDefault = GetNFTRequest.parse(req.query);

  const orderBy = queryWithDefault.orderBy;
  const filterBy = queryWithDefault.filterBy;
  try {
    const nfts = await prisma.nft.findMany({
      take: queryWithDefault.offset,
      skip: queryWithDefault.skip,
      orderBy: {
        [orderBy]: queryWithDefault.order,
      },
      where: {
        ...(filterBy
          ? {
              [filterBy]: queryWithDefault.filterBool,
            }
          : {}),
      },
    });
    res.status(200).json(nfts);
  } catch (error) {
    next(error);
  }
});

// get one nft
app.get("/nfts/:tokenId", async (req, res, next) => {
  try {
    const nft = await prisma.nft.findUnique({
      where: {
        tokenId: parseInt(req.params.tokenId),
      },
      include: {
        offers: {
          include: {
            from: true,
          },
        },
        sales: true,
      },
    });
    res.status(200).json(nft);
  } catch (error) {
    next(error);
  }
});

// create a nft, for create page
app.post("/nfts", async (req, res, next) => {
  try {
    const nft = await prisma.nft.create({
      data: {
        tokenId: parseInt(req.body.tokenId),
        uri: req.body.uri,
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: parseFloat(req.body.price),
        creator: {
          connectOrCreate: {
            where: {
              address: req.body.creatorAddress,
            },
            create: {
              address: req.body.creatorAddress,
            },
          },
        },
        owner: {
          connectOrCreate: {
            where: {
              address: req.body.ownerAddress,
            },
            create: {
              address: req.body.ownerAddress,
            },
          },
        },
      },
    });
    res.status(201).json(nft);
  } catch (error) {
    next(error);
  }
});

// get nfts a user created, for create nft page
app.get("/user/:address/created", async (req, res, next) => {
  try {
    const nfts = await prisma.user
      .findUnique({
        where: {
          address: req.params.address,
        },
      })
      .createdNFTs();
    res.status(200).json(nfts);
  } catch (error) {
    next(error);
  }
});

// get nfts a user created, for create nft page
app.get("/user/:address/collected", async (req, res, next) => {
  try {
    const nfts = await prisma.user
      .findUnique({
        where: {
          address: req.params.address,
        },
      })
      .ownNFTs();
    res.status(200).json(nfts);
  } catch (error) {
    next(error);
  }
});

// get nfts a user created, for create nft page
app.get("/user/:address/offered", async (req, res, next) => {
  try {
    const nfts = await prisma.user
      .findUnique({
        where: {
          address: req.params.address,
        },
      })
      .offers({
        include: {
          nft: true,
        },
      });
    res.status(200).json(nfts);
  } catch (error) {
    next(error);
  }
});

app.patch("/nfts/:tokenId", async (req, res, next) => {
  try {
    const tokenId = parseInt(req.params.tokenId);
    const { userAddr, ...rest } = req.body;
    const nft = await prisma.nft.findUnique({
      where: {
        tokenId: tokenId,
      },
    });
    const owner = nft !== null ? nft.ownerAddress : "";
    const creator = nft !== null ? nft.creatorAddress : "";

    if (owner === "" || creator === "") {
      throw new Error("User not found");
    }

    // if (owner !== "0x0000000000000000000000000000000000000000") {
    //   console.log("owner: ", owner);
    //   if (userAddr.toLowerCase() !== owner.toLowerCase()) {
    //     throw new Error("Permission denied");
    //   }
    // } else {
    //   console.log("creator: ", creator);
    //   if (userAddr.toLowerCase() !== creator.toLowerCase()) {
    //     throw new Error("Permission denied");
    //   }
    // }

    let formattedRest = rest;
    if (rest.price) {
      formattedRest = {
        ...rest,
        price: parseFloat(rest.price),
      };
    }

    // bug here
    const upadatedNft = await prisma.nft.update({
      where: {
        tokenId: tokenId,
      },
      data: {
        ...formattedRest,
      },
    });

    res.status(201).json(upadatedNft);
  } catch (error) {
    next(error);
  }
});

app.patch("/nfts/buy/:tokenId", async (req, res, next) => {
  try {
    const tokenId = parseInt(req.params.tokenId);
    const { price, date, ownerAddr } = req.body;

    const nft = await prisma.nft.findUnique({
      where: {
        tokenId: tokenId,
      },
    });

    if (!nft) {
      throw Error("cannot find this nft");
    }

    const sale = await prisma.sale.create({
      data: {
        price: parseFloat(price),
        date: new Date(date),
        nftTokenId: tokenId,
      },
    });

    const upadatedNft = await prisma.nft.update({
      where: {
        tokenId: tokenId,
      },
      data: {
        listed: false,
        owner: {
          connectOrCreate: {
            where: {
              address: ownerAddr,
            },
            create: {
              address: ownerAddr,
            },
          },
        },
      },
    });
    res.status(201).json(upadatedNft);
  } catch (error) {
    next(error);
  }
});

app.post("/offer", async (req, res, next) => {
  try {
    const offer = await prisma.offer.create({
      data: {
        price: req.body.price,
        createAt: req.body.createAt,
        expireAt: req.body.expireAt,
        from: {
          connectOrCreate: {
            where: {
              address: req.body.fromAddress,
            },
            create: {
              address: req.body.fromAddress,
            },
          },
        },
        nft: {
          connect: {
            tokenId: req.body.nftId,
          },
        },
      },
    });
    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
