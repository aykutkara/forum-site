import { Pipe, PipeTransform } from '@angular/core';
import {ITopic} from "../interfaces/topic.interface";

@Pipe({
  name: 'topicFilter'
})
export class TopicFilterPipe implements PipeTransform {

  transform(topics: ITopic[], filter: string): ITopic[] {

    if (filter === 'oldest') {
      // Tarihe göre sıralama (en eski en başta)
      return topics.sort((a, b) => a.id - b.id);
    } else if (filter === 'newest') {
      // Tarihe göre sıralama (en yeni en başta)
      return topics.sort((a, b) =>  b.id - a.id);
    } else if (filter === 'viewsLowToHigh') {
      // Görüntülenme sayısına göre sıralama (azdan çoğa)
      return topics.sort((a, b) => a.views - b.views);
    } else if (filter === 'viewsHighToLow') {
      // Görüntülenme sayısına göre sıralama (çoktan aza)
      return topics.sort((a, b) => b.views - a.views);
    } else {
      // Filtre yoksa en yeniyi döndür
      return topics.sort((a, b) =>  b.id - a.id);
    }
  }
}
