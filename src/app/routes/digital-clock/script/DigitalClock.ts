import { v4 as uuidv4 } from 'uuid';

interface Position {
    x: number;
    y: number;
}

abstract class DigitalSvgLine {
    public pathString!: string;
    constructor(
        protected readonly lineWeight: number,
        protected readonly lineLength: number
    ) {
        this.pathString = this.createPathString();
    }

    protected abstract createPathString(): string;
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



class DigitalSvgNumber {
    digitalSvglinesMap: Map<keyof DigitalSvgLines, DigitalSvgLine> = new Map();
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

    private readonly one: (keyof DigitalSvgLines)[] = ["topR", "btmR"];
    private readonly two: (keyof DigitalSvgLines)[] = ["topM", "topR", "midM", "btmL", "btmM"];
    private readonly three: (keyof DigitalSvgLines)[] = ["topM", "topR", "midM", "btmR", "btmM"];
    private readonly four: (keyof DigitalSvgLines)[] = ["topL", "midM", "topR", "btmR"];
    private readonly five: (keyof DigitalSvgLines)[] = ["topM", "topL", "midM", ""];
    constructor(num: number) {
        this.createNumSvgLines();
    }

    private createNumSvgLines() {
        this.digitalSvglines = [this.topM, this.topL, this.topR, this.midM, this.btmL, this.btmR, this.btmM];
    }

    private createDigitalSvgLinePaths(num: number) {
        this.digitalSvgLinePaths = this.digitalSvglines.forEach()
    }


}

class SvgElementFactory {
    static svgNs: 'http://www.w3.org/2000/svg' = 'http://www.w3.org/2000/svg';
    static create<K extends keyof SVGElementTagNameMap>(svgElementTagName: K, attributeOption?: { [key: string]: string}) {
        const element = document.createElementNS<K>(SvgElementFactory.svgNs, svgElementTagName); 
        if(attributeOption)
            for(const key in attributeOption) element.setAttribute(key: attributeOption[key]);
        return element;
    }
}

class DigitalClockSvg {
    private filterId = uuidv4();
    constructor(backgroundColor: string, color: string) {
        const svg = this.createSvg();
        const filter = this.createFilter();
        const feGaussianBlur = this.createFeGaussianBlur();
        const 
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