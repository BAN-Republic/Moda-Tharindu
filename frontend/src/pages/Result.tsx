import React from "react";
import BG from "../assets/images/BG.jpg";
import TEXT2 from "../assets/images/TEXT2.png";
import TEXT1 from "../assets/images/TEXT1.png";
import TEXT4 from "../assets/images/TEXT4.png";
import MODA from "../assets/images/MODA METER-08.png";

const Result = () => {
  const saved = localStorage.getItem("tikiri.quizResult");
  const result = saved ? JSON.parse(saved) : null;
  const stupidPercent = result?.stupidPercent ?? 0;

  return (
    <div className="w-full bg-center bg-cover scheme-light">
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <div
          className="relative w-full flex min-h-screen bg-center bg-cover scheme-light"
          style={{ backgroundImage: `url(${BG})` }}
        >
          {/* TOP LOGO */}
          <img
            src={TEXT1}
            alt="Tikiri Logo"
            className="mx-auto top-2 sm:top-4 left-0 right-0 absolute sm:max-w-xs drop-shadow-xl object-contain"
          />

          {/* ⭐ RESULT TEXT (CENTER) ⭐ */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="flex flex-col items-center">
              <p className="text-5xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 drop-shadow-2xl text-center leading-tight">
                {stupidPercent}%
              </p>

              {/* MODA METER IMAGE – responsive */}
              <img
                src={MODA}
                alt="Moda Meter"
                className="
                  mt-3
                  w-50 sm:w-52 md:w-64 lg:w-72
                  max-w-full
                  object-contain
                "
              />
            </div>
          </div>

          {/* BOTTOM LOGO */}
          <img
            src={TEXT2}
            alt="Tikiri Logo"
            className="mx-auto bottom-4 sm:bottom-6 left-0 right-0 absolute max-w-50 sm:max-w-[150px] drop-shadow-xl object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Result;
