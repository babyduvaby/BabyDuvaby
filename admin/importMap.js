import { HeroBlockComponent } from '../src/payload/blocks/HeroBlockComponent'
import { ProductGalleryBlockComponent } from '../src/payload/blocks/ProductGalleryBlockComponent'
import { BannerBlockComponent } from '../src/payload/blocks/BannerBlockComponent'
import { FAQBlockComponent } from '../src/payload/blocks/FAQBlockComponent'
import { TestimonialsBlockComponent } from '../src/payload/blocks/TestimonialsBlockComponent'

export const importMap = {
  './blocks/HeroBlockComponent#HeroBlockComponent': HeroBlockComponent,
  './blocks/ProductGalleryBlockComponent#ProductGalleryBlockComponent': ProductGalleryBlockComponent,
  './blocks/BannerBlockComponent#BannerBlockComponent': BannerBlockComponent,
  './blocks/FAQBlockComponent#FAQBlockComponent': FAQBlockComponent,
  './blocks/TestimonialsBlockComponent#TestimonialsBlockComponent': TestimonialsBlockComponent,
}
