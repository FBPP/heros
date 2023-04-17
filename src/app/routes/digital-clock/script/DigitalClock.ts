import { type } from 'os';
import { v4 as uuidv4 } from 'uuid';

interface Position {
    x: number;
    y: number;
}

abstract class DigitalSvgLine {
    public pathString!: string;
    constructor(
        protected readonly lineWeight: number,
        protected readonly lineLength: number,
        opacity: number,
        protected animationWatiTime: number,
        protected animationDelay: number
    ) {
        this.pathString = this.createPathString(opacity);
    }

    protected abstract createPathString(opacity: number): string;

    private createAnimation($path: SVGPathElement) {
        const $animation1 = SvgElementFactory.create('animate', {
            attributeName: "opacity",
            dur: '0.1s',
            beigin: 
        })
    }
}

// 横向的
class HorizontalDigitalSvgLine extends DigitalSvgLine {
    constructor(
        private startPosition: Position,
        lineWeight: number,
        lineLength: number
    ) {
        super(lineWeight, lineLength);
    }

    protected createPathString(): string {
        let path = `M ${this.startPosition.x} ${this.startPosition.y}`

        path += ` l ${this.lineWeight / 2} -${this.lineWeight / 2}`;
        path += ` l ${this.lineLength - this.lineWeight} 0`;
        path += ` l ${this.lineWeight / 2} ${this.lineWeight / 2}`;
        path += ` l -${this.lineWeight / 2} ${this.lineWeight / 2}`;
        path += ` l -${this.lineLength - this.lineWeight} 0`;
        path += ` Z`;

        return path;
    }
}

// 纵向的
class VerticalDigitalSvgLine extends DigitalSvgLine {
    constructor(
        private startPosition: Position,
        lineWeight: number,
        lineLength: number,
    ) {
        super(lineWeight, lineLength)
    }

    protected createPathString(): string {
        let path = `M ${this.startPosition.x} ${this.startPosition.y}`;
        path += ` l ${this.lineWeight / 2} ${this.lineWeight / 2}`;
        path += ` l 0 ${this.lineLength - this.lineWeight}`;
        path += ` l -${this.lineWeight / 2} ${this.lineWeight / 2}`;
        path += ` l -${this.lineWeight / 2} -${this.lineWeight / 2}`;
        path += ` l 0  -${this.lineLength - this.lineWeight}`;
        path += ` Z`;

        return path;
    }
}

interface DigitalSvgLines {
    "topM": DigitalSvgLine;
    "midM": DigitalSvgLine;
    "topL": DigitalSvgLine;
    "topR": DigitalSvgLine;
    "btmM": DigitalSvgLine;
    "btmL": DigitalSvgLine;
    "btmR": DigitalSvgLine
}

type DigitalNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6| 7 | 8 | 9;


class DigitalSvgNumber {
 
    digitalSvgLinePaths: Set<SVGPathElement> = new Set();

    private readonly lineWeight = 4;
    private readonly lineLength = 12;
    private readonly gap = 1;
    private readonly startPos: Position = {x: 6, y: 6};
    private readonly topM = new HorizontalDigitalSvgLine(this.startPos, this.lineWeight, this.lineLength);
    private readonly midM = new HorizontalDigitalSvgLine({x: this.startPos.x, y: this.startPos.y + this.lineLength + 2 * this.gap}, this.lineWeight, this.lineLength);
    private readonly topL = new VerticalDigitalSvgLine({x: this.startPos.x, y: this.startPos.y + this.gap}, this.lineWeight, this.lineLength);
    private readonly topR = new VerticalDigitalSvgLine({x: this.startPos.x + this.lineLength, y: this.startPos.y + this.gap}, this.lineWeight, this.lineLength);
    private readonly btmM = new HorizontalDigitalSvgLine({x: this.startPos.x, y: this.startPos.y + (this.lineLength  + this.gap) * 2}, this.lineWeight, this.lineLength);
    private readonly btmL = new VerticalDigitalSvgLine({x: this.startPos.x, y: this.startPos.y + this.lineLength + 3 * this.gap}, this.lineWeight, this.lineLength);
    private readonly btmR = new VerticalDigitalSvgLine({x: this.startPos.x + this.lineLength, y: this.startPos.y + this.lineLength + 3 * this.gap}, this.lineWeight, this.lineLength);

    private readonly allLines: Set<keyof DigitalSvgLines> = new Set(["topM", "topL", "topR", "midM", "btmL", "btmR", "btmM"]);
    private readonly zero: Set<(keyof DigitalSvgLines)> = new Set([]);
    private readonly one: Set<(keyof DigitalSvgLines)> = new Set(["topR", "btmR"]);
    private readonly two: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topR", "midM", "btmL", "btmM"]);
    private readonly three: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topR", "midM", "btmR", "btmM"]);
    private readonly four: Set<(keyof DigitalSvgLines)> = new Set(["topL", "midM", "topR", "btmR"]);
    private readonly five: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "midM", "btmR", "btmM"]);
    private readonly six: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "midM", "btmL", "btmM", "btmR"]);
    private readonly seven: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topR", "btmR"]);
    private readonly eight: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "topR", "midM", "btmL", "btmR", "btmM"]);
    private readonly nine: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "topR", "midM", "btmL", "btmR", "btmM"]);

    private readonly numberMap = new Map<DigitalNumber, Set<keyof DigitalSvgLines>>([
        [0, this.zero],
        [1, this.one],
        [2, this.two],
        [3, this.three],
        [4, this.four],
        [5, this.five],
        [6, this.six],
        [7, this.seven],
        [8, this.eight],
        [9, this.nine]
    ]);

    digitalSvglinesMap = new Map<keyof DigitalSvgLines, DigitalSvgLine>([
        ["topL", this.topL],
        ["topM", this.topM],
        ["topR", this.topR],
        ["midM", this.midM],
        ["btmL", this.btmL],
        ["btmR", this.btmR],
        ["btmM", this.btmM],
    ])

    constructor(num: DigitalNumber, delay: number) {
        this.createDigitalSvgLinePaths(num, delay);
    }

    private createDigitalSvgLinePaths(num: DigitalNumber, delay: number) {
        const linesSet = this.numberMap.get(num);
        if(!linesSet) throw '请输入正确的数字'
        for(const [key] of this.digitalSvglinesMap) {
            if(!linesSet.has(key)) {
                // todo setStyle
                
            }
            else {
                // todo setStyle
            }
            // todo setAnimation
        }
    }


}

class SvgElementFactory {
    static svgNs: 'http://www.w3.org/2000/svg' = 'http://www.w3.org/2000/svg';
    static create<K extends keyof SVGElementTagNameMap>(svgElementTagName: K, attributeOption?: { [key: string]: string}) {
        const element = document.createElementNS<K>(SvgElementFactory.svgNs, svgElementTagName); 
        if(attributeOption)
            for(const key in attributeOption) element.setAttribute(key, attributeOption[key]);
        return element;
    }
}

class DigitalClockSvg {
    private filterId = uuidv4();
    constructor(backgroundColor: string, color: string) {
        const svg = this.createSvg();
        const filter = this.createFilter();
        const feGaussianBlur = this.createFeGaussianBlur();
    }

    private createSvg() {
        const svg = SvgElementFactory.create('svg', {
            viewBox: '0 0 140 40'
        });
        return svg;
    }

    private createFilter() {
        const filter = SvgElementFactory.create('filter', {
            id: this.filterId,
            x: '-200%',
            y: '-200%',
            width: '1000%',
            height: '1000%'
        });

        return filter;
    }

    private createFeGaussianBlur() {
        const feGaussianBlur = SvgElementFactory.create('feGaussianBlur', {
            in: "SourceGraphic",
            stdDeviation: "1.4",
        })
    }

    private createBackgroundrect(backgroundColor: string) {
        const rect = SvgElementFactory.create("rect", {
            x: '0%',
            y: '0%',
            height: '100%',
            width: '100%',
            fill: backgroundColor
        })
    }

    private createG(color: string, filterId: string) {
        const g = SvgElementFactory.create("g", {
            fill: color,
            filter: `url#${filterId}`
        });
        const g
    }


}

export class DigitalClock {
    
    constructor(
        private elt: HTMLDListElement,
        private color: string = "#0FF",
        backgroundColor: string = "none"
    ) {
       const now = new Date();
       const hours = now.getHours();
       const minutes = now.getMinutes();
       const seconds= now.getSeconds();
       const milliseconds = now.getMilliseconds();
       let HH = hours.toString().padStart(2, '0');
       let MM = minutes.toString().padStart(2, '0');
       let SS = seconds.toString().padStart(2, '0');

    }

    // populateAnimations = (array)
    createSvg() {
       
        const filter = SvgElementFactory.create('filter');
        filter.setAttribute

    }
}