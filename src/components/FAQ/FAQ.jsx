import React, { useMemo, useState } from "react";
import GlassContainer from "../Recap/RecapComponents/RecapProjects/GlassContainer";

const DEFAULT_FAQ = [
  {
    q: "WHO IS THIS EVENT FOR?",
    a: "Anyone with an open mindset can participate. If you are a beginner at programming, designing, pitching or even quite experienced, this hackathon is for you! Note that only students from Peel District School Board are eligible to participate.",
  },
  {
    q: "WILL THERE BE FOOD?",
    a: "Yep! We love free food",
  },
  {
    q: "DO I NEED A TEAM?",
    a: "You can go solo or participate with a team up with up to 4 individuals! Don't have a team but want to be part of one? You can specify while signing up that you would like to be part of a team and we will also have networking opportunity to make teams at the beginning of hackathon!",
  },
  {
    q: "WHERE CAN I FIND DIRECTIONS TO THE BUILDING?",
    a: "The hackathon is being held at 2665 Erin Centre Blvd, Mississauga, ON L5M 5H6, inside the cafeteria and library.",
  },
  {
    q: "WILL THERE BE PRIZES?",
    a: "Yes!! There will be prizes for the top 3 projects as well as for various categories that you can compete in!",
  },
  {
    q: "WHAT DO I NEED TO BRING?",
    a: "A device to create your project on, chargers, and yourself!",
  },
  {
    q: "ANY QUESTIONS WE DIDN'T ANSWER?",
    a: "You can contact us at fraserhacks24@gmail.com if you have any more questions.",
  },
];

function Chevron({ open }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${
        open ? "rotate-180" : "rotate-0"
      }`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQ({
  items = DEFAULT_FAQ,
  allowMultiple = false,
  defaultOpenIndex = 0,
  className = "",
}) {
  const normalizedDefault = useMemo(() => {
    if (defaultOpenIndex == null) return null;
    const i = Number(defaultOpenIndex);
    return Number.isFinite(i) && i >= 0 && i < items.length ? i : null;
  }, [defaultOpenIndex, items.length]);

  const [openSet, setOpenSet] = useState(() => {
    if (normalizedDefault == null) return new Set();
    return new Set([normalizedDefault]);
  });

  const toggle = (idx) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      const isOpen = next.has(idx);

      if (allowMultiple) {
        if (isOpen) next.delete(idx);
        else next.add(idx);
        return next;
      }

      // single-open behavior
      if (isOpen) return new Set();
      return new Set([idx]);
    });
  };

  return (
    <div className="flex w-full h-full justify-center">
      <div className={`w-full max-w-3xl ${className}`}>
        <div className="mb-3 md:mb-4 lg:mb-4 border-b-2 border-b-zinc-100 rounded-xl px-6 py-3 md:px-6 md:py-4 lg:px-8 lg:py-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-100">
            Frequently Asked Questions
          </h2>
        </div>

        <GlassContainer className="divide-y divide-zinc-500 rounded-2xl border border-zinc-500 bg-transparent shadow-sm">
          {items.map((item, idx) => {
            const isOpen = openSet.has(idx);
            const panelId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;

            return (
              <div key={idx} className="p-0">
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                >
                  <span className="text-xs md:text-base font-semibold tracking-wide text-zinc-200">
                    {item.q}
                  </span>
                  <span className="text-zinc-400" aria-hidden="true">
                    <Chevron open={isOpen} />
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid overflow-hidden px-5 transition-[grid-template-rows,opacity] duration-200 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] pb-4 opacity-100"
                      : "grid-rows-[0fr] pb-0 opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="text-xs md:text-base leading-5 md:leading-6 lg:leading-6 text-zinc-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </GlassContainer>
      </div>
    </div>
  );
}
