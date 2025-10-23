'use client'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'


export default function MangaSlider() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  })

  return (
    <div ref={sliderRef} className="keen-slider">
      <div className="keen-slider__slide"><img src="/1.jpg" alt="page 1" /></div>
      <div className="keen-slider__slide"><img src="/2.jpg" alt="page 2" /></div>
    </div>
  )
}
