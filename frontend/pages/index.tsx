import { Answer } from "@/components/Answer/Answer";
import { Navbar } from "@/components/Navbar";
import { IconArrowBackUp, IconArrowRight, IconExternalLink, IconSearch } from "@tabler/icons-react";
import Head from "next/head";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [mode, setMode] = useState<"search" | "answer">("answer");
  const [matchCount, setMatchCount] = useState<number>(5);

  const resetQuery = () => {
    setQuery("");
    setAnswer("");
    setSources([]);
  }

  const handleAnswer = async () => {
    if (!query) {
      return;
    }

    setAnswer("");

    setLoading(true);

    const answerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
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
    setSources(data.sources);

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
    const PG_MATCH_COUNT = localStorage.getItem("PG_MATCH_COUNT");
    const PG_MODE = localStorage.getItem("PG_MODE");

    if (PG_MATCH_COUNT) {
      setMatchCount(parseInt(PG_MATCH_COUNT));
    }

    if (PG_MODE) {
      setMode(PG_MODE as "search" | "answer");
    }

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
                'Artificial Intelligence for Web3.',
                4000,
                'Artificial Intelligence for ETHRome2023.',
                4000,
                'Artificial Intelligence for BrianKnows.',
                4000,
                'Artificial Intelligence for Ethereum.',
                4000,
                'Artificial Intelligence for EthereansOS.',
                2000,
              ]}
              speed={50}
              style={{ fontSize: '2em' }}
              repeat={Infinity}
            /></div>
          <div className="mx-auto flex h-90 w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
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

                <div className="font-bold text-2xl mt-6">Discover More</div>
                <div className="animate-pulse mt-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                </div>
              </div>
            ) : answer && (
              <div className="mt-6">
                <div className="font-bold text-2xl mb-2">Response</div>
                <Answer text={answer} />

                <div className="mt-6 mb-16">
                  <div className="font-bold text-2xl">Discover More</div>

                  {sources.map((source, index) => (
                    <div key={index}>
                      <div className="mt-4 border border-zinc-600 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            {/* <div className="font-bold text-xl">Punteggio: {source.score}</div> */}
                            <div className="font-bold text-xl">File: {source.node.extra_info.file_name}</div>
                            {source.node.extra_info.page_label && <div className="mt-1 font-bold text-sm">Page {source.node.extra_info.page_label}</div>}
                          </div>
                          <a
                            className="hover:opacity-50 ml-2"
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/static/documents/${source.node.extra_info.file_name}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <IconExternalLink />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}