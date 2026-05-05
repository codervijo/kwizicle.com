import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function HowToPlayPage() {
  return (
    <div className="flex flex-col flex-1 px-4 py-6 max-w-md mx-auto">
      <div className="w-full flex items-center mb-6">
        <Link to="/today" className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-bold mx-auto pr-9">How to Play</h1>
      </div>

      <div className="flex flex-col gap-5 text-sm leading-relaxed">
        <p className="text-base">
          Solve the daily <strong>KWIZICLE</strong> puzzle! Figure out the hidden rule.
        </p>

        <div className="bg-[hsl(var(--primary))] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-2xl justify-center">
            <span>🥝</span><span className="text-primary-foreground font-heading font-bold">+</span><span>🥕</span><span className="text-primary-foreground font-heading font-bold">=</span><span className="font-heading font-bold text-primary-foreground">5</span>
          </div>
          <div className="flex items-center gap-3 text-2xl justify-center">
            <span>🥕</span><span className="text-primary-foreground font-heading font-bold">−</span><span>🥝</span><span className="text-primary-foreground font-heading font-bold">=</span><span className="font-heading font-bold text-primary-foreground">1</span>
          </div>
          <div className="flex items-center gap-3 text-2xl justify-center border-t border-primary-foreground/20 pt-3">
            <span>🥝</span><span className="text-primary-foreground font-heading font-bold">=</span><span className="font-heading font-bold text-primary-foreground/60">?</span>
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          <li className="flex items-start gap-3">
            <span className="text-lg">🔍</span>
            <span>Look at the emoji equations and <strong>solve for the missing value</strong>.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg">🔢</span>
            <span>Enter your answer as a <strong>number</strong>. You get <strong>3 tries</strong>.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <span>After solving (or failing), the <strong>solution is revealed</strong> so you always learn something.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg">🔥</span>
            <span>Keep your <strong>streak</strong> alive by playing every day!</span>
          </li>
        </ul>

        <hr className="border-border" />

        <h2 className="font-heading font-semibold text-lg">FAQ</h2>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold">What is Kwizicle?</h3>
            <p className="text-muted-foreground">Kwizicle is a free daily emoji equation puzzle. Every day, you get emoji equations to solve — figure out what each emoji equals!</p>
          </div>
          <div>
            <h3 className="font-semibold">Is there a new puzzle every day?</h3>
            <p className="text-muted-foreground">Yes! A fresh puzzle is available every day at midnight. Come back daily to maintain your streak.</p>
          </div>
          <div>
            <h3 className="font-semibold">How many attempts do I get?</h3>
            <p className="text-muted-foreground">You get 3 attempts per puzzle. After solving or running out of tries, the hidden rule is revealed.</p>
          </div>
          <div>
            <h3 className="font-semibold">Do I need an account?</h3>
            <p className="text-muted-foreground">No! Kwizicle works entirely without accounts. Your stats and streak are saved locally on your device.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
