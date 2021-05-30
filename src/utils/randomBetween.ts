export default function randomBetween(start: number, end: number): number {
    return start + Math.floor((end - start) * Math.random());
}