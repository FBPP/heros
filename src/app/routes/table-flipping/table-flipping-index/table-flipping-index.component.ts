import { Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from "rxjs"
import gsap from "gsap"

interface Card {
  id: number;
  title: string;
  desc: string;
  photo: string;
}

@Component({
  selector: 'app-table-flipping-index',
  templateUrl: './table-flipping-index.component.html',
  styleUrls: ['./table-flipping-index.component.scss']
})
export class TableFlippingIndexComponent {
  @ViewChild("mask1") mask1Ref!: ElementRef<HTMLDivElement>;
  @ViewChild('mask2') mask2Ref!: ElementRef<HTMLDivElement>;
  @ViewChild("cardInfoTitle") cardInfoTitleRef!: ElementRef<HTMLDivElement>;
  @ViewChild("cardInfoDesc") cardInfoDescRef!: ElementRef<HTMLDivElement>;
  cards: Card[] = [
    {
      id: 1,
      title: "Cincinnati",
      desc: "In different heights and shapes, the four versions of Floema low tables offer a variety of surfaces to satisfy different needs and uses in a contract environment, from work to moments of relaxation.",
      photo:  "https://images.unsplash.com/photo-1649011327045-624a1bd2c3e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=853&q=80"
    },
    {
      id: 2,
      title: "Daytona",
      desc:  "The Circle Coffee table from Wendelbo emulates almost a visual trick. A frame where mass and gravity is suspended, and the slim and delicate structure support the marble top, like a hovering platform.",
      photo: "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
    },
    {
      id: 3,
      title: "Indiana",
      desc: "With an appearance that is at once light and elegant, the Workshop Coffee Table fits perfectly into any living room, serving as a traditional coffee table as well as side table.",
      photo: "https://images.unsplash.com/flagged/photo-1588262516915-e342186ecdf6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
    },
    {
      id: 4,
      title: "Amarillo",
      desc: "Made from sustainably sourced solid American Oak, the Duo Table is composed of two seperate tops joined together on one side. The tops are solid and carved out to create a gentle lip. ",
      photo: "https://images.unsplash.com/photo-1622372738946-62e02505feb3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=832&q=80"
    }
  ]
  currentNum$ = new BehaviorSubject<number>(0)
  currentCard = this.cards[0]

  constructor() {
    this.currentNum$.subscribe(currentNum => {
      this.currentCard = this.cards[currentNum]
    })
  }

  private playFoward() {
    let tl = gsap.timeline({
      defaults: {
        duration: 0.7,
        ease: "sine.out"
      },
      onComplete: () => {
        this.playReverse();
        if(this.currentNum$.value >= 3) {
          this.currentNum$.next(0);
        } else {
          this.currentNum$.next(this.currentNum$.value + 1)
        }
      }
    })

    tl.to(this.mask1Ref.nativeElement, {
      yPercent: 100,
      scaleY: 1.4
    })
    .to(this.mask2Ref.nativeElement, {
      yPercent: -100,
      scaleY: 1.4
    }, '<')
    .to(this.cardInfoTitleRef.nativeElement, {
      clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)'
    }, "<0.4")
    .to(this.cardInfoDescRef.nativeElement, {
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)"
    }, "<0.3")
  }

  private playReverse() {
    let tl = gsap.timeline({
      defaults: {
        duration: 0.7,
        ease: 'sine.in'
      }
    });
    tl.to(this.mask1Ref.nativeElement, {
      yPercent: -100,
      scaleY: 1.4
    })
    .to(this.mask2Ref.nativeElement, {
      yPercent: 100,
      scaleY: 1.4
    }, "<")
    .to(this.cardInfoTitleRef.nativeElement, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    },"<0.2")
    .to(this.cardInfoDescRef.nativeElement, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    }, "<0.3");
  }

  handleNextCardClick() {
    this.playFoward();
  }
}
