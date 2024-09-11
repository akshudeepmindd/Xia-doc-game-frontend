import Navbar from '@/components/common/navbar';
import { Button } from '@/components/ui/button';

import { createLazyFileRoute } from '@tanstack/react-router';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FormattedMessage } from 'react-intl';
const HomeComponent = () => {
  return (
    <>
      <Navbar />

      <div className="bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bigbg.png')] relative">
        <div className="h-[100vh] bg-auto bg-no-repeat bg-center bg-cover bg-[url('/bg.png')]">
          <div className="flex justify-center items-center flex-col h-full px-4 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              <FormattedMessage id="app.elevate" />{' '}
              <span className="text-[#155BE6]">
                <FormattedMessage id="app.gaming" />
              </span>{' '}
              <FormattedMessage id="app.experience" />
            </h1>
            <p className="text-white my-4 text-sm md:text-base lg:text-lg">
              <FormattedMessage id="app.renturroom" />
            </p>
            <Button className="buttoncss rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm md:text-base lg:text-lg">
              <FormattedMessage id="app.getstarted" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto p-4 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 auto-rows-auto">
          <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center space-y-4">
            <img className="w-full h-auto" src="/image1.png" alt="Private Rooms" />
            <div className="flex flex-row justify-between w-full py-4">
              <div className="border-indigo-500 border-t-5 flex-grow"></div>
              <h6 className="text-2xl font-bold text-[#155BE6]">
                <FormattedMessage id="app.privaterooms" />
              </h6>
              <div className="border-indigo-500 border-t-2 flex-grow"></div>
            </div>
            <p className="text-center">
              Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio. Fermentum sit
              a fringilla turpis. Nulla volutpat.
            </p>
            <Button className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
              <FormattedMessage id="app.explore" />
              <img className="ms-1" src="/button.png" alt="Button Icon" />
            </Button>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center space-y-4">
            <img className="w-full h-auto" src="/image2.png" alt="Virtual Room Currency" />
            <div className="flex flex-row justify-between w-full py-4">
              <div className="border-indigo-500 border-t-5 flex-grow"></div>
              <h6 className="text-2xl font-bold text-[#155BE6]">
                <FormattedMessage id="app.virutalcurrency" />
              </h6>
              <div className="border-indigo-500 border-t-2 flex-grow"></div>
            </div>
            <p className="text-center">
              Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio. Fermentum sit
              a fringilla turpis. Nulla volutpat.
            </p>
            <Button className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
              <FormattedMessage id="app.explore" />
              <img className="ms-1" src="/button.png" alt="Button Icon" />
            </Button>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center space-y-4">
            <img className="w-full h-auto" src="/image3.png" alt="USDT Payments" />
            <div className="flex flex-row justify-between w-full py-4">
              <div className="border-indigo-500 border-t-5 flex-grow"></div>
              <h6 className="text-2xl font-bold text-[#155BE6]">
                <FormattedMessage id="app.usdtpayments" />
              </h6>
              <div className="border-indigo-500 border-t-2 flex-grow"></div>
            </div>
            <p className="text-center">
              Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio. Fermentum sit
              a fringilla turpis. Nulla volutpat.
            </p>
            <Button className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
              <FormattedMessage id="app.explore" />
              <img className="ms-1" src="/button.png" alt="Button Icon" />
            </Button>
          </div>
        </div>

        <div className="container my-20 ">
          <div>
            <img className="" src="/card.png" />
            <div className="relative flex justify-center">
              <img className="absolute top-[-155px]" src="/work.png" />
            </div>
            <p className="text-center mt-40 text-[#155BE6]">
              <FormattedMessage id="app.howitworks" /> Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi
              porttitor eget mattis
              <br /> odio. Fermentum sit a fringilla turpis. Nulla volutpat
            </p>
            {/* <div className="container w-[700px] mt-10 flex flex-col justify-center">
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
            </div> */}
            <div className="container w-full max-w-[700px] mt-10 flex flex-col justify-center">
              <div className="card rounded-full border p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <img className="w-[80px] sm:w-[100px] m-2" src="/icon1.png" alt="Recharge Wallet Icon" />
                  <h6 className="text-white text-base sm:text-lg uppercase text-center my-2">
                    <FormattedMessage id="app.recharge" />
                    <br /> <FormattedMessage id="app.wallet" />
                  </h6>
                  <p className="text-[#AE9BD6] text-xs sm:text-sm w-full sm:w-[300px] border rounded-full p-4 sm:p-5 my-2 sm:my-0">
                    Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio.
                    Fermentum sit a fringilla turpis. Nulla volutpat.
                  </p>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <img className="w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px]" src="/arrow1.png" alt="Arrow Icon" />
              </div>

              <div className="card rounded-full border p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <p className="text-[#AE9BD6] text-xs sm:text-sm w-full sm:w-[300px] border rounded-full p-4 sm:p-5 my-2 sm:my-0">
                    Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio.
                    Fermentum sit a fringilla turpis. Nulla volutpat.
                  </p>
                  <h6 className="text-white text-base sm:text-lg uppercase text-center my-2">
                    <FormattedMessage id="app.buy" />
                    <br /> <FormattedMessage id="app.room" />
                  </h6>
                  <img className="w-[80px] sm:w-[100px] m-2" src="/icon2.png" alt="Buy Room Icon" />
                </div>
              </div>

              <div className="flex justify-center my-4">
                <img className="w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px]" src="/arrow2.png" alt="Arrow Icon" />
              </div>

              <div className="card rounded-full border p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <img className="w-[80px] sm:w-[100px] m-2" src="/icon3.png" alt="Play and Manage Icon" />
                  <h6 className="text-white text-base sm:text-lg uppercase text-center my-2">
                    <FormattedMessage id="app.play" /> <FormattedMessage id="app.and" />
                    <br /> <FormattedMessage id="app.manage" />
                  </h6>
                  <p className="text-[#AE9BD6] text-xs sm:text-sm w-full sm:w-[300px] border rounded-full p-4 sm:p-5 my-2 sm:my-0">
                    Lorem ipsum dolor sit amet consectetur. Tortor etiam aliquam mi porttitor eget mattis odio.
                    Fermentum sit a fringilla turpis. Nulla volutpat.
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
                <CarouselItem className="flex justify-center items-center pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game1.png" className="xs:w-full h-auto object-cover" alt="Game 1" />
                </CarouselItem>

                <CarouselItem className="flex justify-center items-center pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game2.png" className="xs:w-full h-auto object-cover" alt="Game 2" />
                </CarouselItem>

                <CarouselItem className="flex justify-center items-center pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game3.png" className="xs:w-full h-auto object-cover" alt="Game 3" />
                </CarouselItem>

                <CarouselItem className="flex justify-center items-center pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game4.png" className="xs:w-full h-auto object-cover" alt="Game 4" />
                </CarouselItem>

                <CarouselItem className="flex justify-center items-center pl-1 md:basis-1/2 lg:basis-1/3">
                  <img src="/game5.png" className="xs:w-full h-auto object-cover" alt="Game 5" />
                </CarouselItem>

                {/* ))} */}
              </CarouselContent>
              <CarouselPrevious className="text-white bg-[#155BE6] p-2 rounded-full lg:left-4 md:left-2 sm:left-0" />
              <CarouselNext className="text-white bg-[#155BE6] p-2 rounded-full lg:right-4 md:right-2 sm:right-0" />
            </Carousel>
          </div>

          {/* <div className="w-[100%]">
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
          </div> */}
          <div className="w-full relative">
            <div className="bg-[#211140] mt-20 p-6 md:p-10 rounded-2xl absolute w-full mx-auto xs:bottom-[553px] md:-bottom-[94px] sm:bottom-[-123px] ">
              <div className="flex flex-col items-center text-center">
                <h6 className="text-white text-xs md:text-sm mb-1">
                  <FormattedMessage id="app.joinus" />
                </h6>
                <h3 className="text-lg md:text-2xl text-[#17D1D1] font-semibold uppercase my-2">
                  <FormattedMessage id="app.joincommunity" />
                </h3>
                <p className="text-white text-xs md:text-sm">
                  <FormattedMessage id="app.joincommunitytext" />
                </p>
                <div className="flex flex-col md:flex-row justify-between mt-4 gap-4 md:gap-6">
                  <Button className="rounded-full bg-[#8BA3D3] border px-4 py-2 md:px-6 md:py-3 flex items-center">
                    <img src="/telegram.png" className="w-[32px] md:w-[44px]" alt="Telegram" />
                    <span className="mx-2 md:mx-4 text-xs md:text-base">Telegram</span>
                  </Button>
                  <Button className="rounded-full bg-[#8BA3D3] border px-4 py-2 md:px-6 md:py-3 flex items-center">
                    <img src="/twitter.png" className="w-[32px] md:w-[44px]" alt="Twitter" />
                    <span className="mx-2 md:mx-4 text-xs md:text-base">Twitter</span>
                  </Button>
                  <Button className="rounded-full bg-[#8BA3D3] border px-4 py-2 md:px-6 md:py-3 flex items-center">
                    <img src="/decord.png" className="w-[32px] md:w-[44px]" alt="Discord" />
                    <span className="mx-2 md:mx-4 text-xs md:text-base">Discord</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bg-[#1E0190] p-10 pt-36 mt-20">
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
        </div> */}
        <div className="bg-[#1E0190] p-10 pt-36 mt-20">
          <div className="flex flex-col md:flex-row justify-between">
            <img src="/logofooter.png" className="w-[80px] h-[80px] mb-6 md:w-[100px] md:h-[100px] md:mb-0" />

            {/* Quick Links */}
            <div className="mb-6 md:mb-0">
              <span className="text-white font-bold text-lg md:text-2xl">Quick Links</span>
              <ul className="mt-4 space-y-2">
                <li className="text-white">
                  <FormattedMessage id="app.aboutus" />
                </li>
                <li className="text-white">
                  <FormattedMessage id="app.howtobuy" />
                </li>
                <li className="text-white">
                  <FormattedMessage id="app.roadmap" />
                </li>
                <li className="text-white">
                  <FormattedMessage id="app.faq" />
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="mb-6 md:mb-0">
              <span className="text-white font-bold text-lg md:text-2xl">Legal</span>
              <ul className="mt-4 space-y-2">
                <li className="text-white">
                  <FormattedMessage id="app.terms" />
                </li>
                <li className="text-white">
                  <FormattedMessage id="app.privacy" />
                </li>
                <li className="text-white">
                  <FormattedMessage id="app.cookiepolicy" />
                </li>
                <li className="text-white">
                  <FormattedMessage id="app.faq" />
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="mb-6 md:mb-0">
              <span className="text-white font-bold text-lg md:text-2xl">
                <FormattedMessage id="app.contact" />
              </span>
              <div className="flex mt-4">
                <img src="/mail.png" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]" />
                <div className="ml-4 text-white">
                  <span>
                    <FormattedMessage id="app.email" />
                  </span>
                  <br />
                  <span className="block">companyemail@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-8"></div>

          {/* Footer */}
          <div className="text-white text-center md:text-left">
            <h5 className="mb-2 text-sm md:text-base">
              <FormattedMessage id="app.rightreserved" />
            </h5>
            <p className="font-extralight text-xs md:text-sm">
              <FormattedMessage id="app.disclaimer" />
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
