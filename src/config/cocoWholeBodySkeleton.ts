// COCO WholeBody skeleton connections config

const COCO_WHOLEBODY_SKELETON: [number, number][] = [
    // BODY
    [5, 6],
    [6, 8], [8, 10],
    [5, 7], [7, 9],
    [6, 12], [5, 11],
    [12, 14], [14, 16],
    [11, 13], [13, 15],
    // FACE
    ...Array.from({ length: 16 }, (_, i): [number, number] => [23 + i, 23 + i + 1]), // Jawline
    ...Array.from({ length: 4 }, (_, i): [number, number] => [45 + i, 45 + i + 1]), // Right eyebrow
    ...Array.from({ length: 4 }, (_, i): [number, number] => [41 + i, 41 + i + 1]), // Left eyebrow
    [50, 51], [51, 52], [52, 53], [53, 56], [56, 55], [55, 54], [56, 57], [57, 58], // Nose bridge and bottom
    ...Array.from({ length: 5 }, (_, i): [number, number] => [65 + i, 65 + i + 1]), // Right eye
    ...Array.from({ length: 5 }, (_, i): [number, number] => [59 + i, 59 + i + 1]), // Left eye
    ...Array.from({ length: 10 }, (_, i): [number, number] => [71 + i, 71 + i + 1]), // Outer lips
    [72, 84], [84, 85], [85, 86], [86, 87], [87, 77], // Inner lips
    // LEFT HAND
    [91, 92], [92, 93], [93, 94],
    [91, 95], [95, 96], [96, 97],
    [91, 98], [98, 99], [99, 100],
    [91, 101], [101, 102], [102, 103],
    [91, 104], [104, 105], [105, 106],
    // RIGHT HAND
    [112, 113], [113, 114], [114, 115],
    [112, 116], [116, 117], [117, 118],
    [112, 119], [119, 120], [120, 121],
    [112, 122], [122, 123], [123, 124],
    [112, 125], [125, 126], [126, 127],
];

export default COCO_WHOLEBODY_SKELETON;
