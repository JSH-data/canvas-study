export default class CloseValue {
    flag = 0
    progress = 0;
    startTime = 0;
    durationTime = 0;
    fromValue = 0;
    toValue = 0;
    maxValue = 1;
    minValue = 0;
    minDuration: number;
    maxDuration: number;


    constructor(minTime: number, maxTime: number) {
        this.minDuration = minTime;
        this.maxDuration = maxTime;
    }

    init(): number {
        this.durationTime = this.minDuration + (this.maxDuration - this.minDuration) * Math.random();
        this.startTime = Date.now();
        this.progress = Math.min(1, ((Date.now() - this.startTime) / this.durationTime))
        this.fromValue = this.toValue;
        this.toValue = this.minValue + this.maxValue * Math.random();
        this.flag = 1;
        return this.fromValue + (this.toValue - this.fromValue) * this.progress;
    }
    update(): number {
        this.progress = Math.min(1, ((Date.now() - this.startTime) / this.durationTime));
        if (this.progress == 1) this.flag = 0;
        return this.fromValue + (this.toValue - this.fromValue) * this.progress;
    }
    execution() {
        if (this.flag == 0) { return this.init() }
        else { return this.update() }
    }
}