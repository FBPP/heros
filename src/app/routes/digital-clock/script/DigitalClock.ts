import { v4 as uuidv4 } from 'uuid';

interface Position {
    x: number;
    y: number;
}

abstract class DigitalSvgLine {
    public path!: SVGPathElement;
    constructor(
        protected readonly lineWeight: number,
        protected readonly lineLength: number,
        protected readonly startPosition: Position,
        opacity: number,
    ) {
        const pathString = this.createPathString();
        this.path = this.createPath(pathString, opacity);
    }

    protected abstract createPathString(): string;
    private createPath(pathString: string, opacity: number): SVGPathElement {
        const path = SvgElementFactory.create("path", {
            d: pathString,
            opacity: opacity.toString()
        });
        path.style.transition = '0.1s';

        return path;
    }

    public changeOpacity(opacity: number) {
        this.path.setAttribute("opacity", opacity.toString());
    }
}

// 横向的
class HorizontalDigitalSvgLine extends DigitalSvgLine {
    constructor(
        startPosition: Position,
        lineWeight: number,
        lineLength: number,
        opacity: number
    ) {
        super(lineWeight, lineLength, startPosition, opacity);

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
        startPosition: Position,
        lineWeight: number,
        lineLength: number,
        opacity: number
    ) {
        super(lineWeight, lineLength, startPosition, opacity);
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
    private readonly lineWeight = 4;
    private readonly lineLength = 12;
    private readonly gap = 1;
    private readonly startPos: Position = {x: 6, y: 6};

    private readonly allLines: Set<keyof DigitalSvgLines> = new Set(["topM", "topL", "topR", "midM", "btmL", "btmR", "btmM"]);

    private readonly zero: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "topR", "btmL", "btmR", "btmM"]);
    private readonly one: Set<(keyof DigitalSvgLines)> = new Set(["topR", "btmR"]);
    private readonly two: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topR", "midM", "btmL", "btmM"]);
    private readonly three: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topR", "midM", "btmR", "btmM"]);
    private readonly four: Set<(keyof DigitalSvgLines)> = new Set(["topL", "midM", "topR", "btmR"]);
    private readonly five: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "midM", "btmR", "btmM"]);
    private readonly six: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "midM", "btmL", "btmM", "btmR"]);
    private readonly seven: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topR", "btmR"]);
    private readonly eight: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "topR", "midM", "btmL", "btmR", "btmM"]);
    private readonly nine: Set<(keyof DigitalSvgLines)> = new Set(["topM", "topL", "topR", "midM", "btmR", "btmM"]);


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

    private readonly startPositionsMap = new Map<keyof DigitalSvgLines, Position>([
        ["topM", this.startPos],
        ["midM", {x: this.startPos.x, y: this.startPos.y + this.lineLength + 2 * this.gap}],
        ["topL", {x: this.startPos.x, y: this.startPos.y + this.gap}],
        ["topR", {x: this.startPos.x + this.lineLength, y: this.startPos.y + this.gap}],
        ["btmM", {x: this.startPos.x, y: this.startPos.y + (this.lineLength + this.gap * 2) * 2}],
        ["btmL", {x: this.startPos.x, y: this.startPos.y + this.lineLength + 3 * this.gap}],
        ["btmR", {x: this.startPos.x + this.lineLength, y: this.startPos.y + this.lineLength + 3 * this.gap}]
    ]);

    private digitalSvglinesMap = new Map<keyof DigitalSvgLines, DigitalSvgLine>()

    public svgNumberG!: SVGGElement;

    constructor(num: DigitalNumber, translateX: number) {
        this.createSvgNum(num, translateX);
    }

    private createSvgNum(num: DigitalNumber, translateX: number) {
        const linesSet = this.numberMap.get(num);
        if(!linesSet) throw '请输入正确的数字'
        for(const key of this.allLines) {
            let opacity = 0;
            if(!linesSet.has(key)) {
                opacity = 0;
            }
            else {
                opacity = 1  
            }

            const startPos = this.startPositionsMap.get(key);
            if(!startPos) throw "没有找到对应的名称"
            if(key == "topM" || key == "midM" || key =="btmM") this.digitalSvglinesMap.set(key, new HorizontalDigitalSvgLine(startPos, this.lineWeight, this.lineLength, opacity));
            else this.digitalSvglinesMap.set(key, new VerticalDigitalSvgLine(startPos, this.lineWeight, this.lineLength, opacity));
        }

        const g = SvgElementFactory.create("g", {
            transform: `translate(${translateX} 0)`
        });
        for(const [key, svgline] of  this.digitalSvglinesMap) {
            g.appendChild(svgline.path);
        }

        this.svgNumberG = g;
    }

    public changeOpacity(num: DigitalNumber) {
        const linesSet = this.numberMap.get(num);
        if(!linesSet) throw "请输入正确的数字";
        for(const [key, svgline] of this.digitalSvglinesMap) {
            if(linesSet.has(key)) svgline.changeOpacity(1);
            else svgline.changeOpacity(0);
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
    private h1!: DigitalSvgNumber;
    private h2!: DigitalSvgNumber;
    private m1!: DigitalSvgNumber;
    private m2!: DigitalSvgNumber;
    private s1!: DigitalSvgNumber;
    private s2!: DigitalSvgNumber;
    public svg!: SVGGElement;
    private gId!: string;

    constructor(backgroundColor: string, color: string, h: number, m: number, s: number) {
        this.svg = this.createSvg();
        const filter = this.createFilter();
        const feGaussianBlur = this.createFeGaussianBlur();
        filter.appendChild(feGaussianBlur);
        this.svg.appendChild(filter);

        const backgroundRect = this.createBackgroundrect(backgroundColor);
        this.svg.appendChild(backgroundRect);

        const g_wrap = this.createGWrap(color);
        const g = this.createG();
        g_wrap.appendChild(g);
        this.h1 = this.createH1(<DigitalNumber>Math.trunc(h / 10));
        this.h2 = this.createH2(<DigitalNumber>(h % 10));
        this.m1 = this.createM1(<DigitalNumber>Math.trunc(m / 10));
        this.m2 = this.createM2(<DigitalNumber>(m % 10));
        this.s1 = this.createS1(<DigitalNumber>Math.trunc(s / 10));
        this.s2 = this.createS2(<DigitalNumber>(s % 10));

        g.appendChild(this.h1.svgNumberG);
        g.appendChild(this.h2.svgNumberG);
        g.appendChild(this.createDotH());
        g.appendChild(this.m1.svgNumberG);
        g.appendChild(this.m2.svgNumberG);
        g.appendChild(this.createDotM());
        g.appendChild(this.s1.svgNumberG);
        g.appendChild(this.s2.svgNumberG);
        this.svg.append(g_wrap);
        
        const use = this.createUse(this.gId, color);
        this.svg.append(use);
        
    }

    public changeNumer(h: number, m: number, s: number) {
        this.h1.changeOpacity(<DigitalNumber>Math.trunc(h / 10));
        this.h2.changeOpacity(<DigitalNumber>(h % 10));
        this.m1.changeOpacity(<DigitalNumber>Math.trunc(m / 10));
        this.m2.changeOpacity(<DigitalNumber>(m % 10));
        this.s1.changeOpacity(<DigitalNumber>Math.trunc(s / 10));
        this.s2.changeOpacity(<DigitalNumber>(s % 10));
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
            x: '-100%',
            y: '-100%',
            width: '500%',
            height: '500%'
        });

        return filter;
    }

    private createFeGaussianBlur() {
        const feGaussianBlur = SvgElementFactory.create('feGaussianBlur', {
            in: "SourceGraphic",
            stdDeviation: "1",
        })
        return feGaussianBlur;
    }

    private createBackgroundrect(backgroundColor: string) {
        const rect = SvgElementFactory.create("rect", {
            x: '0%',
            y: '0%',
            height: '100%',
            width: '100%',
            fill: backgroundColor
        });
        return rect;
    }

    private createGWrap(color: string) {
        const g = SvgElementFactory.create("g", {
            fill: color,
            filter: `url(#${this.filterId})`
        });
        return g;
    }

    private createG() {
        this.gId = uuidv4();
        const g = SvgElementFactory.create("g", {
            id: this.gId
        });
        return g;
    }

    private createDotH() {
        const path = SvgElementFactory.create("path", {
            d: "M92 11v4h4v-4ZM 92 25v4h4v-4Z"
        });

        return path;
    }

    private createDotM() {
        const path = SvgElementFactory.create("path", {
            d: "M44 11v4h4v-4ZM 44 25v4h4v-4Z"
        });
        return path;
    }

    private createH1(num: DigitalNumber) {
        const svgNumber = new DigitalSvgNumber(num, 0);
        return svgNumber;
    }

    private createH2(num: DigitalNumber) {
        const svgNumber = new DigitalSvgNumber(num, 20);
        return svgNumber;
    }

    private createM1(num: DigitalNumber) {
        const svgNumber = new DigitalSvgNumber(num, 48);
        return svgNumber;
    }

    private createM2(num: DigitalNumber) {
        const svgNumber = new DigitalSvgNumber(num, 68);
        return svgNumber;
    }

    private createS1(num: DigitalNumber) {
        const svgNumber = new DigitalSvgNumber(num, 96);
        return svgNumber;
    }

    private createS2(num: DigitalNumber) {
        const svgNumber = new DigitalSvgNumber(num, 116);
        return svgNumber;
    }
    private createUse(href: string, fill: string) {
        const use = SvgElementFactory.create("use", {
            href: `#${href}`,
            fill: `${fill}`
        });
        return use
    }
}

export class DigitalClock {
    private digitalClockSvg!: DigitalClockSvg;

    constructor(
        elt: HTMLDivElement,
        color: string = "#0FF",
        backgroundColor: string = "none"
    ) {
       const now = new Date();
       const hours = now.getHours();
       const minutes = now.getMinutes();
       const seconds = now.getSeconds();
       const milliseconds = now.getMilliseconds();
       this.digitalClockSvg = new DigitalClockSvg(backgroundColor, color, hours, minutes, seconds);
       elt.appendChild(this.digitalClockSvg.svg);

       setTimeout(() => {
        this.changeTimeNumber();
        setInterval(() => {
            this.changeTimeNumber();
        }, 1000)
       }, milliseconds)

    }

    private changeTimeNumber() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        this.digitalClockSvg.changeNumer(hours, minutes, seconds);
    }
}