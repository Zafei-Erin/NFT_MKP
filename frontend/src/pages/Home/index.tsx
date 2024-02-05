import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { NFT } from "@/types/types";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useSWR, { Fetcher } from "swr";

const apiURL = import.meta.env.VITE_API_URL;
const fetcher: Fetcher<NFT[], string> = (url: string) =>
  fetch(url).then((data) => data.json());

export const Home = () => {
  return (
    <div className="h-[calc(100vh-6rem)] flex items-start justify-center">
      <ImgCarousel />
    </div>
  );
};

const ImgCarousel: React.FC = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  const { data: nfts } = useSWR(`${apiURL}/nfts`, fetcher, { suspense: true });

  const bgUrl = useMemo(() => {
    if (nfts && nfts.length && nfts[current - 1]) {
      return `url('${nfts[current - 1].imageUrl}')`;
    }
  }, [current, nfts]);

  return (
    <div
      className="absolute w-full top-0 bg-cover bg-center transition-all ease-in-out duration-800"
      style={{ backgroundImage: bgUrl }}
    >
      {!nfts.length ? (
        <div className=" h-lvh text-2xl font-bold text-sky-600 flex items-center justify-center">
          <p>No items in marketplace</p>
        </div>
      ) : (
        <div className="w-full h-full backdrop-blur-3xl pt-48 flex justify-center 2xl:px-2 items-end overflow-hidden mx-auto max-w-screen-[98rem]">
          <Carousel
            opts={{
              align: "center",
              loop: true,
              breakpoints: {
                "(min-width: 640px)": { align: "start" },
              },
            }}
            setApi={setCarouselApi}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full p-1 group"
          >
            <div className="grid grid-cols-[minmax(20px,_30px)_1fr_minmax(20px,_30px)] space-x-1 items-center justify-between">
              <CarouselPrevious className="flex flex-col h-full w-5 2xl:w-9 group-hover:bg-gray-500/60 rounded-md bg-transparent text-transparent border-0 group-hover:text-gray-100 transition duration-300 ease-out" />
              <CarouselContent className="flex justify-center sm:justify-start flex-row gap-2 lg:gap-4 ml-0 snap-x">
                {nfts.map((nft, i) => (
                  <CarouselItem
                    key={i}
                    className={cn(
                      "relative basis-[90%] w-full p-0 sm:basis-[49%] md:basis-[32.5%] lg:basis-[24%]",
                      i == nfts.length - 1 && "mr-2 lg:mr-4"
                    )}
                  >
                    <Link to={`/item/${nft.tokenId}`} className="">
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="object-cover aspect-square w-full rounded-lg"
                      />
                      <div className="absolute bottom-0 flex h-[40%] w-full flex-col justify-end space-y-1 rounded-b-lg bg-gradient-to-b from-transparent to-gray-900/30 px-4 pb-4 text-gray-200">
                        <div className="truncate font-semibold">{nft.name}</div>
                        <div className="text-sm">Price: {nft.price} ETH</div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="flex flex-col h-full w-5 2xl:w-9 group-hover:bg-gray-500/60 rounded-md bg-transparent text-transparent border-0 group-hover:text-gray-100 transition duration-300 ease-out" />
            </div>
          </Carousel>
        </div>
      )}
    </div>
  );
};
