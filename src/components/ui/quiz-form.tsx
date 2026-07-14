"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

interface QuizFormProps {
  title: string;
  questions: Question[];
  onComplete?: (score: number, total: number) => void;
}

export function QuizForm({ title, questions, onComplete }: QuizFormProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQ + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQ];
  const selectedAnswer = selectedAnswers[currentQuestion.id];

  const handleSelect = (value: string) => {
    setSelectedAnswers({...selectedAnswers, [currentQuestion.id]: parseInt(value) });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setSubmitted(true);
      setShowResults(true);
      const score = calculateScore();
      onComplete?.(score, questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const calculateScore = () => {
    return questions.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correctAnswer? 1 : 0);
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setShowResults(false);
  };

  const score = calculateScore();
  const percentage = (score / questions.length) * 100;
  const passed = percentage >= 70;

  if (showResults) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <p className="text-muted-foreground">{title}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={cn(
              "text-6xl font-bold",
              passed? "text-green-500" : "text-red-500"
            )}>
              {score}/{questions.length}
            </div>
            <p className="text-lg mt-2">{percentage.toFixed(0)}%</p>
            <p className={cn(
              "font-medium mt-1",
              passed? "text-green-600" : "text-red-600"
            )}>
              {passed? "🎉 Passed!" : "❌ Try Again"}
            </p>
          </div>

          <Progress value={percentage} className={cn(
            "h-3",
            passed? "[&>div]:bg-green-500" : "[&>div]:bg-red-500"
          )} />

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    {isCorrect?
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" /> :
                      <XCircle className="h-5 w-5 text-red-500 mt-1" />
                    }
                    <div className="flex-1">
                      <p className="font-medium">{idx + 1}. {q.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your answer: {q.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-sm mt-2 p-2 bg-muted rounded">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={resetQuiz} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle>{title}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentQ + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {currentQ + 1}. {currentQuestion.question}
          </h3>

          <RadioGroup value={selectedAnswer?.toString()} onValueChange={handleSelect}>
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="cursor-pointer flex-1 py-2">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQ === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
        >
          {currentQ === questions.length - 1? "Submit Quiz" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
