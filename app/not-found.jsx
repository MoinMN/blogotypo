"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NotFound() {
  const { data: session } = useSession();
  const router = useRouter();

  const homePage = session?.user?.role === 'user' ? '/dashboard' : '/admin/dashboard';
  return (
    <div className="bg-gradient-to-b lg:bg-gradient-to-r from-yellow-100 via-white to-white min-h-[94vh] sm:min-h-screen w-full flex flex-col lg:flex-row justify-around items-center gap-20 md:px-32 max-md:p-10">

      <div className="flex flex-col gap-2 items-start max-sm:items-center">
        <div className="flex flex-col items-start max-sm:items-center">
          <h3 className="montserrat_alternates_font text-4xl md:text-6xl lg:text-7xl font-bold my-2">
            Oooops...
          </h3>
          <h5 className="playwrite_in_font text-lg md:text-xl lg:text-2xl font-semibold my-1">
            Page Not Found!
          </h5>
          <span className="playfair_font text-lg md:text-xl lg:text-2xl text-wrap py-4 max-sm:text-center">
            The page you are looking for doesn't exist or an other error may occurred, go back to home page
          </span>
        </div>
        <button
          onClick={() => router.push(homePage)}
          className="montserrat_alternates_font text-base md:text-lg lg:text-xl bg-yellow-400 px-4 py-2 hover:bg-yellow-500 hover:rounded-2xl transition-all duration-200 ease-in-out my-4">
          Go Back
        </button>
      </div>

      <div className="">
        <Image
          src={process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/assets/images/404.jpg'}
          width={500}
          height={500}
        />
      </div>
    </div>
  )
}