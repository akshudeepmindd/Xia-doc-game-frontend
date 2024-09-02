import GamesGrid from '@/components/games-grid';
import Navbar from '@/components/common/navbar';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
const HomeComponent = () => {
  return (
    <>
      <Navbar />

      <div className="bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bigbg.png')] relative">
        <div className="h-[100vh] bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bg.png')] ">
          <div className="flex justify-center items-center flex-col h-[100vh]">
            <h1 className="text-4xl font-bold text-white">
              Elevate Your <span className="text-[#155BE6]">Gaming</span> Experience
            </h1>
            <p className="text-white my-4">Rent private gaming rooms and control your game like never before.</p>
            <Button className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
              Get Started
            </Button>
          </div>
        </div>
        <div className="gap-3 columns-3 container">
          <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
            <div className="flex justify-center items-center flex-col relative">
              <img className="" src="/image1.png" />
              <div className="flex flex-row justify-between py-4">
                <div className="border-indigo-500 border-t-5"></div>
                <h6 className="text-2xl font-bold text-[#155BE6] ">Private Rooms</h6>
                <div className="border-indigo-500 border-t-2"></div>
              </div>
              <p className="text-center pb-4">
                Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio. Fermentum
                sit a fringilla turpis. Nulla volutpat
              </p>
              <div className="absolute -bottom-10">
                <Button className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  EXPLORE
                  <img className="ms-1" src="/button.png" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
            <div className="flex justify-center items-center flex-col relative">
              <img className="" src="/image2.png" />
              <div className="flex flex-row justify-between py-4">
                <div className="border-indigo-500 border-t-5"></div>
                <h6 className="text-2xl font-bold text-[#155BE6] ">Virtual Room Currency</h6>
                <div className="border-indigo-500 border-t-2"></div>
              </div>
              <p className="text-center pb-4">
                Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio. Fermentum
                sit a fringilla turpis. Nulla volutpat
              </p>
              <div className="absolute -bottom-10">
                <Button className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  EXPLORE
                  <img className="ms-1" src="/button.png" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
            <div className="flex justify-center items-center flex-col relative">
              <img className="" src="/image3.png" />
              <div className="flex flex-row justify-between py-4">
                <div className="border-indigo-500 border-t-5"></div>
                <h6 className="text-2xl font-bold text-[#155BE6] ">USDT Payments</h6>
                <div className="border-indigo-500 border-t-2"></div>
              </div>
              <p className="text-center pb-4">
                Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio. Fermentum
                sit a fringilla turpis. Nulla volutpat
              </p>
              <div className="absolute -bottom-10">
                <Button className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  EXPLORE
                  <img className="ms-1" src="/button.png" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="container my-20 ">
          <div>
            <img className="" src="/card.png" />
            <div className="relative flex justify-center">
              <img className="absolute top-[-155px]" src="/work.png" />
            </div>
            <p className="text-center mt-40 text-[#155BE6]">
              How It Works? Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis
              <br /> odio. Fermentum sit a fringilla turpis. Nulla volutpat
            </p>
            <div className="container w-[700px] mt-10 flex flex-col justify-center">
              <div className="card rounded-full border">
                <div className="flex flex-row justify-between items-center">
                  <img className="w-[100px] m-2" src="/icon1.png" />
                  <h6 className="text-white uppercase text-center">
                    recharge
                    <br /> Wallet
                  </h6>
                  <p className="text-[#AE9BD6] text-xs w-[300px] border rounded-full p-5">
                    Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio.
                    Fermentum sit a fringilla turpis. Nulla volutpat
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <img className="w-[300px]" src="/arrow1.png" />
              </div>
              <div className="card rounded-full border">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-[#AE9BD6] text-xs w-[300px] border rounded-full p-5">
                    Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio.
                    Fermentum sit a fringilla turpis. Nulla volutpat
                  </p>
                  <h6 className="text-white uppercase text-center">
                    buy
                    <br /> room
                  </h6>

                  <img className="w-[100px] m-2" src="/icon2.png" />
                </div>
              </div>
              <div className="flex justify-center">
                <img className="w-[300px]" src="/arrow2.png" />
              </div>
              <div className="card rounded-full border">
                <div className="flex flex-row justify-between items-center">
                  <img className="w-[100px] m-2" src="/icon3.png" />
                  <h6 className="text-white uppercase text-center">
                    play and
                    <br /> manage
                  </h6>
                  <p className="text-[#AE9BD6] text-xs w-[300px] border rounded-full p-5">
                    Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio.
                    Fermentum sit a fringilla turpis. Nulla volutpat
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-20 mb-60">
            <h5 className="text-[#155BE6] text-2xl uppercase text-center mb-10">popular in casino</h5>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {/* {Array.from({ length: 5 }).map((_, index) => ( */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  {/* <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-3xl font-semibold">{index + 1}</span>
                        </CardContent>
                      </Card> */}
                  <img src="/game1.png" />
                </CarouselItem>

                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game2.png" />
                </CarouselItem>
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game3.png" />
                </CarouselItem>
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game4.png" />
                </CarouselItem>
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game5.png" />
                </CarouselItem>
                {/* ))} */}
              </CarouselContent>
              <CarouselPrevious className="absolute top-[383px] left-[560px]" />
              <CarouselNext className="absolute top-[383px] right-[640px]" />
            </Carousel>
          </div>
          <div className="w-[100%]">
            <div className="bg-[#211140] mt-20  p-6 rounded-2xl absolute bottom-[420px] w-[1280px]">
              <div className="flex justify-center flex-col items-center">
                <h6 className="text-white text-sm mb-1">Join us right now!</h6>
                <h3 className="text-xl text-[#17D1D1] font-semibold uppercase my-2">Join The Community</h3>
                <p className="text-white text-sm">
                  Join us in the arena and stay connected with exclusive content and updates in our communities!
                </p>
                <div className="flex justify-between mt-4 gap-6">
                  <Button className="rounded-full bg-[#8BA3D3] border px-2 py-6 ">
                    <img src="/telegram.png" className="w-[44px]" />
                    <span className="mx-4">Telegram</span>
                  </Button>
                  <Button className="rounded-full bg-[#8BA3D3] border px-2 py-6 ">
                    <img src="/twitter.png" className="w-[44px]" />
                    <span className="mx-4">Twitter</span>
                  </Button>
                  <Button className="rounded-full bg-[#8BA3D3] border px-2 py-6 ">
                    <img src="/decord.png" className="w-[44px]" />
                    <span className="mx-4">Discord</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#1E0190] p-10 pt-36 mt-20">
          <div className="flex justify-between">
            <img src="/logofooter.png" className="w-[100px] h-[100px]" />
            <div className="">
              <span className="text-white font-bold text-2xl ">Quick Links</span>

              <ul className="mt-4">
                <li className="text-white mb-2">About us</li>
                <li className="text-white mb-2">How to buy</li>
                <li className="text-white mb-2">Roadmap</li>
                <li className="text-white mb-2">FAQs</li>
              </ul>
            </div>
            <div className="">
              <span className="text-white font-bold text-2xl ">Legal</span>

              <ul className="mt-4">
                <li className="text-white mb-2">About us</li>
                <li className="text-white mb-2">How to buy</li>
                <li className="text-white mb-2">Roadmap</li>
                <li className="text-white mb-2">FAQs</li>
              </ul>
            </div>
            <div className="">
              <span className="text-white font-bold text-2xl ">Contact</span>

              <div className="flex mt-4 ">
                <img src="/mail.png" className="w-[40px] h-[40px]" />
                <div className="ms-4 text-white">
                  Email Address <br />
                  <span className="">companyemail@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border my-8"></div>
          <div className=" text-white">
            <h5 className="mb-2">©2024 by Company Name All Right & Reserved.</h5>
            <p className="font-extralight">
              Disclaimer: Cryptocurrency may be unregulated in your jurisdiction. The value of cryptocurrencies may go
              down as well as up. Profits may be subject to capital gains or other taxes applicable in your
              jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </>
    // <Tabs defaultValue="k-sport" className="w-full">
    //   <TabsList>
    //     <TabsTrigger value="k-sport">K Sport</TabsTrigger>
    //     <TabsTrigger value="shoot-fish">Shoot Fish</TabsTrigger>
    //   </TabsList>
    //   <TabsContent value="k-sport">
    //     <GamesGrid />
    //   </TabsContent>
    //   <TabsContent value="shoot-fish">
    //     <div></div>
    //   </TabsContent>
    // </Tabs>
  );
};

export const Route = createLazyFileRoute('/_base/')({
  component: HomeComponent,
});
