import React from "react";
import { renderMathContent } from "@/utils/latexRenderer";

export function LatexTest() {
  const testExpressions = [
    { label: "Simple Fraction", content: "$\\frac{1}{2}$" },
    { label: "Complex Fraction", content: "$\\frac{3}{4}$" },
    { label: "Large Fraction", content: "$\\frac{7}{8}$" },
    { label: "Decimal", content: "0.5" },
    { label: "Percentage", content: "50%" },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        LaTeX Rendering Test
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testExpressions.map((expr, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="font-bold mb-2">{expr.label}</h3>
            <div className="text-lg">{renderMathContent(expr.content)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
