import { Answer } from "@/components/Answer/Answer";
import { Quadrotto } from "@/components/Quadrotto/Quadrotto";
import { Navbar } from "@/components/Navbar";
import { IconArrowBackUp, IconArrowRight, IconExternalLink, IconSearch } from "@tabler/icons-react";
import Head from "next/head";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";

import {
  BeakerIcon
} from '@heroicons/react/24/outline'
import SelectMenu from "@/components/SelectMenu/selectMenu";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  // const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [mode, setMode] = useState<"search" | "answer">("answer");
  const [matchCount, setMatchCount] = useState<number>(5);

  const prompts = ["query the first 3 domains name", "give me a domain list", "give me the first domain name and his metadata"];

  const resetQuery = () => {
    setQuery("");
    setAnswer("");
  }

  type SelectItem =
    | {
      key: string
      name: string
    }
    | {
      key: string
      name: string
    }

  const CHAT_TYPES: SelectItem[] = [
    {
      key: 'ENS',
      name: 'ENS',
    },
    {
      key: 'Azuro',
      name: 'Azuro',
    },
  ]

  const [chatTypeList, setChatType] = useState<SelectItem[]>(CHAT_TYPES)
  const [chatTypeKey, chatTypeSetKey] = useState<string>(CHAT_TYPES[0].key)

  const handleAnswer = async () => {
    if (!query) {
      return;
    }

    setAnswer("");

    setLoading(true);

    const answerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bitapai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, chatTypeKey })
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = await answerResponse.json();

    if (!data) {
      return;
    }

    setLoading(false);

    console.log("answer data: ", data);

    setAnswer(data.answer);

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {

      handleAnswer();
    }
  };

  useEffect(() => {
    if (matchCount > 10) {
      setMatchCount(10);
    } else if (matchCount < 1) {
      setMatchCount(1);
    }
  }, [matchCount]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Head>
        <title>CarbonarAI 🍝</title>
        <meta
          name="description"
          content={`L'intelligenza artificiale per i tuoi documenti.`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="https://ethrome.org/favicon.png"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="mt-6 text-center text-lg px-3">
            <TypeAnimation
              preRenderFirstString={true}
              sequence={[
                2000,
                'Artificial Intelligence for The Graph.', // initially rendered starting point
                4000,
                'Artificial Intelligence for ENS.',
                4000,
                'Artificial Intelligence for Azuro.',
                4000,
                'Artificial Intelligence for Web3.',
                4000,
                'Artificial Intelligence for ETHRome2023.',
                4000,
                'Artificial Intelligence for Ethereum.',
                2000
              ]}
              speed={50}
              style={{ fontSize: '2em' }}
              repeat={Infinity}
            /></div>
          <div className="mx-auto flex h-90 w-full max-w-6xl flex-col items-center px-3 pt-4 sm:pt-8">

            <div className="relative w-full mt-4">
              <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />

              <input
                ref={inputRef}
                className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
                type="text"
                placeholder="Ask me anything!"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button>
                <IconArrowBackUp
                  onClick={resetQuery}
                  className={`absolute right-4 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-16 sm:top-3 sm:h-10 sm:w-10 text-white`}
                />
              </button>

              <button disabled={!query || query.trim().length <= 0}>
                <IconArrowRight
                  onClick={handleAnswer}
                  className={`absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white ${(!query || query.trim().length <= 0) && 'cursor-not-allowed opacity-50 pointer-events-none'}`}
                />
              </button>
            </div>
            <SelectMenu
              label="Query Type"
              items={chatTypeList}
              selectedKey={chatTypeKey}
              onChange={keyValue => {
                chatTypeSetKey(keyValue)
              }}
            />
            {answer ? (
              <></>
            ) : (
              <div className="mt-6 text-center items-center">
                <>
                  <div className="inline-flex" >
                    <BeakerIcon style={{ height: "1rem", position: "relative", top: "0.3rem" }}></BeakerIcon>
                    Try asking something!
                  </div>
                  <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 place-items-center">
                    {prompts.map((prompt, pIndex) => {
                      return (
                        <div
                          onClick={() => {
                            setQuery(prompt)
                          }}
                          key={pIndex}
                          className="text-gray-500 hover:bg-gray-200 hover:text-gray-700 rounded-md cursor-pointer text-xs p-1 text-center transition"
                        >
                          <p>{prompt}</p>
                        </div>
                      )
                    })}
                  </div>
                </>
              </div>
            )}

            {loading ? (
              <div className="mt-6 w-full">
                {mode === "answer" && (
                  <>
                    <div className="font-bold text-2xl">Response</div>
                    <div className="animate-pulse mt-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                    </div>
                  </>
                )}
              </div>
            ) : answer && (
              <div className="mt-6">
                <div className="font-bold text-2xl mb-2">Response</div>
                <Answer text={answer} />

                {/* <div className="mt-6 mb-16">
                  <div className="font-bold text-2xl">Discover More</div>

                </div> */}
              </div>
            )}

            <div className="inline-flex" >
              <Quadrotto text="ENS" src="/ens.svg" href="https://ens.domains/" />
              <Quadrotto text="The Graph" src="/the-graph.svg" href="https://thegraph.com/" />
              <Quadrotto text="Bittensor" src="/bittensor.svg" href="https://bittensor.com/" />
              <Quadrotto text="Azuro" src="/azuro.svg" href="https://azuro.org/" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
