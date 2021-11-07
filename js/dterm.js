class DTerm {
    /** @type {number} */
    static FS = 18.33;
    /** @type {string} */
    static FF = '"Courier New", monospace';
    /** @type {number} */
    static UW = 11;
    /** @type {number} */
    static UH = 21;

    /** @type {HTMLElement} */
    #parent;
    /** @type {DTermContainer[]} */
    #containerList;
    /** @type {number} */
    #layerCount;
    /** @type {HTMLDivElement} */
    #mouse;

    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        this.#containerList = new Array();
        this.#layerCount = 0;
        this.#parent = parent;
        this.#parent.classList.add('dterm-terminal');
        this.#parent.style.fontSize = DTerm.FS + 'px';
        this.#parent.style.fontFamily = DTerm.FF;
        this.#mouse = document.createElement('div');
        this.#mouse.classList.add('dterm-mouse');
        this.#mouse.style.width = DTerm.UW + 'px';
        this.#mouse.style.height = DTerm.UH + 'px';

        this.#calcParentPadding();
        window.addEventListener('resize', () => this.#calcParentPadding());
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            this.#mouse.style.left = x - (x % DTerm.UW) + 'px';
            this.#mouse.style.top = y - (y % DTerm.UH) + 'px';
        });
        this.#parent.appendChild(this.#mouse);
    }

    /**
     * @returns {DTermContainer[]} List of container elements.
     */
     get containerList() {
        return this.#containerList;
    }

    /**
     * @returns {DTermContainer} Container object.
     */
    newContainer() {
        this.#layerCount += 1;
        const dTermContainer = new DTermContainer(this.#layerCount);
        const container = dTermContainer.container;
        if (this.#layerCount <= 1) {
            container.style.right = 0;
            container.style.bottom = 0;
        }
        this.#parent.appendChild(container);
        this.#containerList.push(container);
        return dTermContainer;
    }

    #calcParentPadding() {
        const innerWidth = this.#parent.offsetWidth;
        const paddingX = innerWidth % DTerm.UW;
        this.#parent.style.paddingLeft = (DTerm.UW * 2) + 'px';
        this.#parent.style.paddingRight = (DTerm.UW * 2) + paddingX + 'px';
        const innerHeight = this.#parent.offsetHeight;
        const paddingY = innerHeight % DTerm.UH;
        this.#parent.style.paddingTop = DTerm.UH + 'px';
        this.#parent.style.paddingBottom = DTerm.UH + paddingY + 'px';
    }
}

/**
 * Not to be manually instantiated.
 * Use newContainer() from DTerm to create new instance instead.
 */
class DTermContainer {
    /** @type {number} */
    #layer;
    /** @type {HTMLDivElement} */
    #container;
    /** @type {HTMLDivElement} */
    #border;
    /** @type {HTMLDivElement} */
    #term;
    /** @type {HTMLDivElement} */
    #bg;

    /**
     * @param {number} layerCount
     */
    constructor(layerCount) {
        this.#layer = layerCount;
        this.#container = document.createElement('div');
        this.#border = document.createElement('div');
        this.#term = document.createElement('div');
        this.#bg = document.createElement('div');

        this.#container.classList.add('dterm-container');
        this.#container.style.zIndex = layerCount.toString();
        this.#border.classList.add('dterm-border');
        this.#border.style.zIndex = (layerCount * 1000000).toString();
        this.#term.classList.add('dterm-term');
        this.#term.style.zIndex = (layerCount * 1000000).toString();
        this.#bg.classList.add('dterm-bg');
        this.#bg.style.zIndex = layerCount.toString();

        this.#container.appendChild(this.#border);
        this.#container.appendChild(this.#term);
        this.#container.appendChild(this.#bg);
    }

    /**
     * @returns {number} Layer position.
     */
    get layer() {
        return this.#layer;
    }

    /**
     * @returns {HTMLDivElement} Container element.
     */
    get container() {
        return this.#container;
    }

    /**
     * @param {string} text
     */
    setText(text) {
        DTermUtil.setInnerHTML(this.#term, text);
    }

    /** @type {HTMLDivElement} */
    #borderN;
    /** @type {HTMLDivElement} */
    #borderS;
    /** @type {HTMLDivElement} */
    #borderE;
    /** @type {HTMLDivElement} */
    #borderW;
    static #B = {
        'thin': {
            X: '─', Y: '│', NW: '┌', NE: '┐', SW: '└', SE: '┘',
            IN: '┬', IS: '┴', IE: '┤', IW: '├', IM: '┼',
        },
        'double': {
            X: '═', Y: '║', NW: '╔', NE: '╗', SW: '╚', SE: '╝',
            IN: '╦', IS: '╩', IE: '╣', IW: '╠', IM: '╬',
        },
    };
    /**
     * @param {'thin' | 'bold' | 'double'} type
     */
    setBorder(type = 'double') {
        this.#term.style.top = DTerm.UH + 'px';
        this.#term.style.bottom = DTerm.UH + 'px';
        this.#term.style.left = (DTerm.UW * 2) + 'px';
        this.#term.style.right = (DTerm.UW * 2) + 'px';
        this.#borderN = document.createElement('div');
        this.#borderS = document.createElement('div');
        this.#borderE = document.createElement('div');
        this.#borderW = document.createElement('div');
        this.#borderN.classList.add('dterm-border-n');
        this.#borderS.classList.add('dterm-border-s');
        this.#borderE.classList.add('dterm-border-e');
        this.#borderW.classList.add('dterm-border-w');
        this.#drawBorder(type);
        window.addEventListener('resize', () => this.#drawBorder(type));
    }
    /**
     * @param {'thin' | 'bold' | 'double'} type
     */
    #drawBorder(type) {
        const B = DTermContainer.#B[type];
        const innerWidth = this.#container.offsetWidth;
        const innerHeight = this.#container.offsetHeight;
        const unitX = innerWidth / DTerm.UW;
        const unitY = innerHeight / DTerm.UH;

        this.#borderN.style.bottom = (DTerm.UH * (unitY - 1)) + 'px';
        this.#borderS.style.top = (DTerm.UH * (unitY - 1)) + 'px';
        this.#borderE.style.left = (DTerm.UW * (unitX - 1)) + 'px';
        this.#borderW.style.right = (DTerm.UW * (unitX - 1)) + 'px';
        this.#borderN.style.height = DTerm.UH + 'px';
        this.#borderS.style.height = DTerm.UH + 'px';
        this.#borderE.style.width = DTerm.UW + 'px';
        this.#borderW.style.width = DTerm.UW + 'px';
        DTermUtil.setInnerHTML(this.#borderN, B.NW + B.X.repeat(unitX - 2) + B.NE);
        DTermUtil.setInnerHTML(this.#borderS, B.SW + B.X.repeat(unitX - 2) + B.SE);
        DTermUtil.setInnerHTML(this.#borderE, B.NE + B.Y.repeat(unitY - 2) + B.SE);
        DTermUtil.setInnerHTML(this.#borderW, B.NW + B.Y.repeat(unitY - 2) + B.SW);
        this.#border.appendChild(this.#borderN);
        this.#border.appendChild(this.#borderS);
        this.#border.appendChild(this.#borderE);
        this.#border.appendChild(this.#borderW);
    }
}

class DTermUtil {
    /**
     * @param {HTMLElement} element
     * @param {string} text
     */
    static setInnerHTML(element, text) {
        element.innerHTML = text
                .replace(/ /gm, '&nbsp;')
                .replace(/(\r\n|\n|\r)/gm, '<br>');
    }
}
