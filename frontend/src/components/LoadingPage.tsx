import { Loader } from "@/assets";

export const LoadingPage = () => {
  return (
    <div className="flex items-center h-[calc(100vh-6rem)] justify-center">
      <Loader className="w-36 stroke-sky-600" />
    </div>
  );
};
