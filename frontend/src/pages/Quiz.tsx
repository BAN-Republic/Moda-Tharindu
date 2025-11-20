import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Btemplate from "../assets/images/LBG.png";
import TEXT2 from "../assets/images/TEXT2.png";
import TEXT1 from "../assets/images/TEXT1.png";
import BG from "../assets/images/BG.jpg";

/** ---- Types ----- */
type Choice = "A" | "B";
type Answer = Choice | null;

type Question = {
  id: number;
  prompt: string;
  optionA: string;
  optionB: string;
};

type QuizResult = {
  answers: Answer[];
  yesCount: number;
  noCount: number;
  stupidPercent: number; // 0–100
};
type StupidRule = "A" | "B" | "BOTH";

const STUPID_RULES: StupidRule[] = [
  "A",    // Q1: "නෑ" (optionA) is මෝඩ
  "B",    // Q2: "ඔව්" (optionB) is මෝඩ
  "B",    // Q3: "ඔව්" (optionB) is මෝඩ
  "B",    // Q4: "ඔව්" (optionB) is මෝඩ
  "BOTH", // Q5: both answers are මෝඩ
  "B",    // Q6: "නෑ" (optionB) is මෝඩ
  "B",    // Q7: "නෑ" (optionB) is මෝඩ
  "A",    // Q8: "ඔව්" (optionA) is මෝඩ
  "A",    // Q9: "ඔව්" (optionA) is මෝඩ
  "BOTH", // Q10: both answers are මෝඩ
];
/** ------- Data: questions -------- */
const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: " 1) මෝඩ තරිඳු බැලුවද?",
    optionB: "ඔව්",
    optionA: "නෑ",
  },
  {
    id: 2,
    prompt: "2) ඔයා බැඳලද?",
    optionB: "ඔව් ",
    optionA: "නෑ",
  },
  {
    id: 3,
    prompt: "3) බීලා වාහන පැදලා තියෙනවද?",
    optionB: "ඔව්",
    optionA: "නෑ",
  },
  {
    id: 4,
    prompt: "4) ඔයාගේ partner කියන ඕන දෙයක් කරනවද?",
    optionB: "ඔව්",
    optionA: "නෑ",
  },
  {
    id: 5,
    prompt: "5) ඔයා ඔයාගේ හොඳම යාලුවාව විශ්වාස කරනවද?",
    optionA: " ඔව්",
    optionB: "නෑ",
  },
  {
    id: 6,
    prompt: "6) ඔයාගෙ partner ට bf or gf කෙනෙක් ඉන්නවද?",
    optionA: " ඔව්",
    optionB: "නෑ",
  },
  {
    id: 7,
    prompt: "7) බීලා Ex ට කෝල් කරලා තියෙනවද?",
    optionA: "ඔව්",
    optionB: "නෑ",
  },

  {
    id: 8,
    prompt: "8) ඔයාගෙ partner ව සැක කරනවද?",
    optionA: "ඔව්",
    optionB: "නෑ",
  },
  {
    id: 9,
    prompt: "9) සාස්තර / දේවාල විශ්වාස කරනවද?",
    optionA: "ඔව්",
    optionB: "නෑ",
  },
  {
    id: 10,
    prompt: "10) මේ ප්‍රශ්න ඔක්කොටම ඔයා උත්තර දුන්නද?",
    optionA: "ඔව්",
    optionB: "නෑ",
  },
];

const Quiz = () => {
  const total = QUESTIONS.length;
  const navigate = useNavigate();
  const QUIZ_KEY = "tikiri.quizResult";

  // show splash first
  const [started, setStarted] = useState(false);

  // answers[i] corresponds to QUESTIONS[i]
  const [answers, setAnswers] = useState<Answer[]>(
    Array.from<Answer>({ length: total }).fill(null)
  );
  const [page, setPage] = useState(0); // current question index

  // 🔀 Stable per-question shuffle plan (computed once)
  const shufflePlan: Choice[][] = useMemo(() => {
    return QUESTIONS.map(() => (Math.random() < 0.5 ? ["A", "B"] : ["B", "A"]));
  }, []);

  const isResultPage = page >= total;
  const isLastQuestion = page === total - 1;
  const currentQuestion = !isResultPage ? QUESTIONS[page] : null;
  const selectedForCurrent = !isResultPage ? answers[page] : null;

  // Options to render for current question follow the precomputed shuffle plan
  const shuffledOptionsForCurrent = useMemo(() => {
    if (!currentQuestion || isResultPage) return [];
    const plan = shufflePlan[page]; // ["A","B"] or ["B","A"]
    return plan.map((key) => ({
      key,
      label: key === "A" ? currentQuestion.optionA : currentQuestion.optionB,
    }));
  }, [currentQuestion, isResultPage, page, shufflePlan]);

  const { yesCount, noCount, stupidPercent } = useMemo(() => {
    let stupid = 0;
  
    answers.forEach((ans, idx) => {
      if (!ans) return;
  
      const rule = STUPID_RULES[idx];
  
      if (rule === "BOTH") {
        // any answer is stupid
        stupid += 1;
      } else if (rule === ans) {
        // chosen option matches the stupid one
        stupid += 1;
      }
    });
  
    const totalAnswered = total; // or answers.filter(Boolean).length;
    const stupidPct =
      totalAnswered === 0 ? 0 : Math.round((stupid / totalAnswered) * 100);
  
    return {
      // re-using yesCount/noCount, but now yesCount = "stupid count"
      yesCount: stupid,
      noCount: totalAnswered - stupid,
      stupidPercent: stupidPct,
    };
  }, [answers, total]);
  
  

  const choose = (choice: Choice) => {
    if (isResultPage) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[page] = choice;
      return next;
    });
  };

  const next = () => {
    if (isResultPage) return;
    if (answers[page] == null) return; // require an answer
    setPage((p) => p + 1);
  };

  const back = () => {
    if (page === 0) return;
    setPage((p) => p - 1);
  };

  // const restart = () => {
  //   setAnswers(Array.from<Answer>({ length: total }).fill(null));
  //   setPage(0);
  //   setStarted(false);
  //   localStorage.removeItem(QUIZ_KEY);
  // };

  return (
    <div
      className=" w-full  bg-center bg-cover scheme-light"
      // style={{ backgroundImage: `url(${Btemplate})` }}
    >
      {/* Slight overlay & padding for readability on top of BG */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center ">
        {!started ? (
          // ---------- Splash Screen ----------
          <div
            className=" w-full flex min-h-screen bg-center bg-cover scheme-light"
            style={{ backgroundImage: `url(${Btemplate})` }}
          >
            <div className="w-full flex flex-col realtive max-w-md sm:max-w-lg mx-auto p-6 sm:p-8 md:p-10 text-center items-center justify-center">
              <img
                src={TEXT1}
                alt="Tikiri Logo"
                className="mx-auto top-0 absolute max-w-[350px] sm:max-w-xs drop-shadow-xl object-contain"
              />

              {/* <div className="flex flex-col items-center justify-center mt-4">
              <span className="text-red-800 font-bold w-60 font-sans animate-pulse text-sm sm:text-base">
                Tap the Finger
              </span>
            </div> */}
              {/* <p className="mt-4 text-[10px] sm:text-xs font-semibold font-sans text-gray-700 p-3 sm:p-4 bg-white/80 rounded-lg leading-relaxed">
              This app offers educational insights on emotions and brain
              tendencies; results may be inaccurate and are not for medical,
              psychological, legal, or employment use.
            </p> */}

              <button
                onClick={() => setStarted(true)}
                className="absolute bottom-0 mt-8 mb-4 px-10 py-1 border-2 border-amber-500 rounded-2xl bg-amber-950 opacity-70 text-amber-300 text-5xl sm:text-base font-extrabold tracking-wide shadow-md active:scale-95 transition "
              >
                <span className="inline-block">PLAY</span>
              </button>

              {/* Disclaimer */}
            </div>
          </div>
        ) : (
          // ---------- Quiz UI ----------
          <div
            className=" w-full flex flex-col min-h-screen bg-center bg-cover scheme-light"
            style={{ backgroundImage: `url(${BG})` }}
          >
            <img
              src={TEXT1}
              alt="Tikiri Logo"
              className="mx-auto top-0 left-0 right-0 absolute max-w-[350px] sm:max-w-xs drop-shadow-xl object-contain"
            />

            <div className="w-full absolute left-0 right-0 top-0 bottom-0 max-w-3xl p-4 sm:p-6 md:p-8 lg:p-10 mt-70">
              {/* Optional top area (kept for future logos) */}
              {/* <div className="flex flex-row items-center justify-center mb-4 sm:mb-6">
                <img src={FindUColor} alt="" className="w-50" />
              <img src={AsamaTikirMole} alt="" className="w-50" />
              </div> */}

              {!isResultPage && (
                <div className="flex flex-row items-center justify-center mb-4">
                  {/* <img
                  src={QUESTION_IMAGES[page]}
                  alt={`Question ${page + 1}`}
                  className="w-50"
                /> */}
                </div>
              )}

              {/* Header / Progress */}
              <header className="mb-5 sm:mb-6">
                {/* {!isResultPage ? (
                  <p className="text-lg sm:text-sm text-gray-600 mt-1 text-center sm:text-left">
                    Question {page + 1} of {total}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 text-center sm:text-left">
                    Your Results
                  </p>
                )} */}

                {/* Progress bar */}
                <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all"
                    style={{
                      width: `${Math.min(
                        ((isResultPage ? total : page) / total) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </header>

              {/* Content */}
              {!isResultPage ? (
                <section>
                  {/* Question card */}
                  <div className="p-4 sm:p-5 md:p-6 rounded-xl flex flex-col justify-center items-center min-h-[20vh] sm:min-h-[15vh]">
                    <p className="sm:text-xl md:text-2xl text-2xl font-bold font-sans text-center">
                      {currentQuestion?.prompt}
                    </p>

                    <div className="mt-4 sm:mt-5 grid gap-3 sm:gap-4 w-full relative items-center justify-center">
                      {shuffledOptionsForCurrent.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => choose(opt.key)}
                          className={`w-full p-3 sm:p-4 rounded-xl border text-sm sm:text-base transition text-center 
                          ${
                            selectedForCurrent === opt.key
                              ? "border-green-600 ring-2 ring-green-200 bg-green-50"
                              : "hover:bg-gray-50 bg-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nav buttons */}
                  <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center sm:items-center justify-center gap-3 sm:gap-4">
                    <button
                      onClick={back}
                      disabled={page === 0}
                      className="w-[50%] sm:w-auto px-6 py-2 rounded-full border hover:bg-gray-50 disabled:opacity-40 text-sm sm:text-base"
                    >
                      Back
                    </button>

                    {isLastQuestion ? (
                      <button
                        onClick={() => {
                          if (answers[page] == null) return;

                          const payload: QuizResult = {
                            answers,
                            yesCount,
                            noCount,
                            stupidPercent,
                          };
                          

                          localStorage.setItem(
                            QUIZ_KEY,
                            JSON.stringify(payload)
                          );
                          navigate("/result");
                        }}
                        className={`w-[50%] sm:w-auto px-6 py-2 rounded-full text-white text-sm sm:text-base ${
                          answers[page] == null
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={next}
                        disabled={answers[page] == null}
                        className={`w-[50%] sm:w-auto px-6 py-2 rounded-full text-white text-sm sm:text-base
                        ${
                          answers[page] == null
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Next
                      </button>
                    )}
                  </div>
                  <img
                    src={TEXT2}
                    alt="Tikiri Logo"
                    className="mx-auto -bottom-20 left-0 right-0 absolute max-w-[120px] sm:max-w-xs drop-shadow-xl object-contain"
                  />
                </section>
              ) : (
                // ---------- Result Page ----------
                <section className="space-y-5 sm:space-y-6 pb-4">
                  {/* <div className="p-4 sm:p-5 md:p-6 bg-white rounded-xl border">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-center sm:text-left">
                      Result
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-indigo-50 border">
                        <p className="font-medium text-sm sm:text-base">
                          A (Right-brain)
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold mt-1">
                          {percentA}%
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {countA} of {total} answers
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-gray-50 border">
                        <p className="font-medium text-sm sm:text-base">
                          B (Left-brain)
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold mt-1">
                          {percentB}%
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {countB} of {total} answers
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5 p-4 rounded-lg bg-green-50 border text-sm sm:text-base">
                      {verdict === "RIGHT" && (
                        <p className="text-green-800">
                          You are{" "}
                          <span className="font-semibold">
                            right-brain like
                          </span>{" "}
                          — more creative, visual, and intuitive.
                        </p>
                      )}
                      {verdict === "LEFT" && (
                        <p className="text-green-800">
                          You are{" "}
                          <span className="font-semibold">left-brain like</span>{" "}
                          — more analytical, structured, and logical.
                        </p>
                      )}
                      {verdict === "TIE" && (
                        <p className="text-green-800">
                          You’re <span className="font-semibold">balanced</span>{" "}
                          — great mix of creative and analytical strengths.
                        </p>
                      )}
                    </div>
                  </div> */}

                  {/* <div className="flex justify-center sm:justify-between">
                    <button
                      onClick={restart}
                      className="px-5 py-2 rounded-xl border hover:bg-gray-50 text-sm sm:text-base"
                    >
                      Restart
                    </button>
                  </div> */}
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
