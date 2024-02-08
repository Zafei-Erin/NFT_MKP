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
    <div className="max-w-screen-[98rem] flex items-start justify-center ">
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
      className="duration-800 absolute top-0 w-full bg-cover bg-center transition-all ease-in-out "
      style={{ backgroundImage: bgUrl }}
    >
      {!nfts.length ? (
        <div className="flex h-lvh items-center justify-center text-2xl font-bold text-sky-600">
          <p>No items in marketplace</p>
        </div>
      ) : (
        <div className="mx-auto flex h-full w-full items-end justify-center overflow-hidden pt-48 backdrop-blur-3xl 2xl:px-2">
          <Carousel
            opts={{
              loop: true,
              breakpoints: {
                "(min-width: 640px)": { align: "start" },
              },
            }}
            setApi={setCarouselApi}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="group flex h-full w-full items-center p-1"
          >
            <div className="grid grid-cols-[auto_1fr_auto] items-center justify-between space-x-1">
              <CarouselPrevious className="flex h-full w-5 items-center justify-self-center rounded-md border-0 bg-transparent text-transparent transition-all duration-300 ease-out group-hover:bg-gray-500/60 group-hover:text-gray-100 lg:w-8" />
              <CarouselContent className="items-centerlg:-ml-4 -ml-2 flex">
                {nfts.map((nft, i) => (
                  <CarouselItem
                    key={i}
                    className="w-full basis-full pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 lg:pl-4"
                  >
                    <Link to={`/item/${nft.tokenId}`} className="relative">
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="aspect-square w-full overflow-hidden rounded-xl object-cover"
                      />
                      <div className="absolute bottom-0 flex h-[40%] w-full flex-col justify-end space-y-1 rounded-b-xl bg-gradient-to-b from-transparent to-gray-900/30 px-4 pb-4 text-gray-200">
                        <div className="truncate font-semibold">{nft.name}</div>
                        <div className="text-sm">Price: {nft.price} ETH</div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="flex h-full w-5 items-center justify-self-center rounded-md border-0 bg-transparent text-transparent transition-all duration-300 ease-out group-hover:bg-gray-500/60 group-hover:text-gray-100 lg:w-8" />
            </div>
          </Carousel>
        </div>
      )}
    </div>
  );
};
