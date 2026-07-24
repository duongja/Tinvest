import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import { readJsonResponse, responseError } from "./http";

type WaitlistState = "idle" | "loading" | "done" | "error";

const orbitDots = Array.from({ length: 18 }, (_, index) => index);
const telegramBotUrl = "https://t.me/Tinvester1bot";
const demoAppUrl = "/app?token=STON&amount=0.1";

export function Landing() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<WaitlistState>("idle");
  const [message, setMessage] = useState("");
  const metrics = useMemo(
    () => [
      ["AI", "research"],
      ["TON", "tokens"],
      ["STON.fi", "buying"]
    ],
    []
  );
  async function joinWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          source: "landing",
          metadata: {
            page: "/",
            userAgent: navigator.userAgent
          }
        })
      });
      const body = await readJsonResponse<{ error?: string }>(response);
      if (!response.ok) {
        throw new Error(responseError(body, "Could not join waitlist"));
      }
      setStatus("done");
      setMessage("You're on the list.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not join waitlist");
    }
  }

  return (
    <main className="landingShell">
      <section className="landingCopy" aria-labelledby="landing-title">
        <nav className="brandBar" aria-label="Tinvest">
          <span className="brandMark">
            <img src="/icon.png" alt="" />
          </span>
          <span>Tinvest</span>
        </nav>

        <div className="heroStack">
          <p className="eyebrow">TON ecosystem investment intelligence</p>
          <h1 id="landing-title">See the TON ecosystem with sharper intelligence.</h1>
          <p className="lead">
            AI analysis for TON tokens, combining STON.fi market data, on-chain signals, and off-chain ecosystem events.
          </p>
        </div>

        <form className="waitlistForm" onSubmit={joinWaitlist}>
          <label htmlFor="waitlist-email">Join the private waitlist</label>
          <div className="emailRow">
            <input
              id="waitlist-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Joining" : "Join"}
            </button>
          </div>
          <p className={`waitlistMessage ${status === "error" ? "errorText" : ""}`} aria-live="polite">
            {message || "Early users get access to token briefs, event alerts, and STON.fi-powered buying."}
          </p>
        </form>

        <div className="metricStrip" aria-label="Platform focus">
          {metrics.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="betaStage" aria-label="Tinvest live beta access">
        <div className="wealthOrbit" aria-hidden="true">
          <div className="starfield">
            {orbitDots.map((dot) => (
              <i key={dot} style={{ "--dot": dot } as CSSProperties} />
            ))}
          </div>
          <div className="orbit orbitOuter" />
          <div className="orbit orbitMiddle" />
          <div className="orbit orbitInner" />
          <div className="planetCore">
            <span>TON</span>
          </div>
          <div className="coin coinOne">$</div>
          <div className="coin coinTwo">₮</div>
          <div className="coin coinThree">AI</div>
        </div>

        <aside className="testerAccess" aria-labelledby="tester-title">
          <div className="testerTopline">
            <span className="testerBadge"><i aria-hidden="true" /> Live beta</span>
            <span className="testerChannel">Telegram access</span>
          </div>

          <div className="testerIntro">
            <h2 id="tester-title">Tinvest beta is live.</h2>
            <span>Research TON tokens, run AI risk checks, and review live STON.fi quotes directly in Telegram.</span>
          </div>

          <div className="testerActions">
            <a className="telegramButton" href={telegramBotUrl} target="_blank" rel="noreferrer">
              Open in Telegram <span aria-hidden="true">↗</span>
            </a>
            <a className="demoButton" href={demoAppUrl}>
              Preview Mini App
            </a>
          </div>

          <p className="testerTrust"><span aria-hidden="true">✓</span> Non-custodial. Every transaction requires wallet approval.</p>
        </aside>
      </section>
    </main>
  );
}
