"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@innate/ui"

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="rounded-xl border bg-card p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-3">{children}</CardContent>
    </Card>
  )
}

const SLIDES = [
  { label: "Slide 1", color: "bg-blue-500/15 text-blue-700" },
  { label: "Slide 2", color: "bg-purple-500/15 text-purple-700" },
  { label: "Slide 3", color: "bg-pink-500/15 text-pink-700" },
  { label: "Slide 4", color: "bg-orange-500/15 text-orange-700" },
  { label: "Slide 5", color: "bg-green-500/15 text-green-700" },
]

export function CarouselDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Basic loop"
        description="Five slides with prev/next buttons — loop is enabled by default."
      >
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {SLIDES.map((slide, i) => (
              <CarouselItem key={slide.label}>
                <div
                  className={`flex aspect-video items-center justify-center rounded-md border text-sm font-medium ${slide.color}`}
                >
                  {slide.label} (#{i + 1})
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>

      <Section
        title="Multiple per view"
        description="Use basis classes on CarouselItem to show more than one slide."
      >
        <Carousel className="w-full max-w-sm">
          <CarouselContent className="-ml-2">
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.label} className="pl-2 md:basis-1/2">
                <div
                  className={`flex aspect-square items-center justify-center rounded-md border text-sm font-medium ${slide.color}`}
                >
                  {slide.label}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;carousel | carousel-content | carousel-item |
          carousel-previous | carousel-next&quot;
        </code>
        ; built on embla-carousel-react.
      </p>
    </div>
  )
}

export default CarouselDemo
