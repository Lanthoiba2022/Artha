export function TypingIndicator() {
  return (
    <div className="mr-auto flex items-start gap-2.5 animate-fade-in-up">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-primary shadow-sm">
        <span className="text-[10px] font-bold text-white">A</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border/30 bg-card/60 px-4 py-3 shadow-sm backdrop-blur-sm">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/50" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/50" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/50" />
      </div>
    </div>
  );
}
