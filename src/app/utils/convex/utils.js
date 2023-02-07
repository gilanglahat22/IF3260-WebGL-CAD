const checkSmallerPivot = (point, pivot) => {
    return point.position[0] < pivot.position[0] || (point.position[0] == pivot.position[0] && point.position[1] < pivot.position[1])
}

const checkBiggerPivot = (point, pivot) => {
    return point.position[0] > pivot.position[0] || (point.position[0] == pivot.position[0] && point.position[1] > pivot.position[1])
}

export const isDeterminantPositive = (p1, p2, p3) => {
    const determinant = (p1.position[0] * p2.position[1] + p2.position[0] * p3.position[1] + p3.position[0] * p1.position[1]) - (p1.position[1] * p2.position[0] + p2.position[1] * p3.position[0] + p3.position[1] * p1.position[0])
    return determinant > 0
}

export const quickSort = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[0]

    const smaller = quickSort(arr.slice(1).filter((point) => checkSmallerPivot(point, pivot)))
    const bigger = quickSort(arr.slice(1).filter((point) => checkBiggerPivot(point, pivot)))

    return smaller.concat([pivot], bigger)
}

const distance = (p1, p2, p3) => {
    const A = p1.position[1] - p2.position[1];
    const B = p2.position[0] - p1.position[0];
    const C = p1.position[0] * p2.position[1] - p2.position[0] * p1.position[1];

    return Math.abs(A * p3.position[0] + B * p3.position[1] + C) / Math.sqrt(A * A + B * B);
}

const findAngle = (minAbs, maxAbs, pMax) => {
    const aSide = Math.pow(pMax.position[0] - maxAbs.position[0], 2) + Math.pow(pMax.position[1] - maxAbs.position[1], 2)
    const bSide = Math.pow(minAbs.position[0] - pMax.position[0], 2) + Math.pow(minAbs.position[1] - pMax.position[1], 2)
    const cSide = Math.pow(minAbs.position[0] - maxAbs.position[0], 2) + Math.pow(minAbs.position[1] - maxAbs.position[1], 2)
    const cos = (aSide - bSide - cSide) / (-2 * Math.sqrt(bSide) * Math.sqrt(cSide))
    return Math.acos(Math.round(cos, 10)) * 180 / Math.PI
}

export const findPMax = (arr, minAbs, maxAbs) => {
    let currentDistance = 0
    let maxDistance = 0
    let maxIndex = 0
    let maxAngle = 0

    for (let i = 0; i < arr.length; i++) {
        currentDistance = distance(minAbs, maxAbs, arr[i])
        maxAngle = findAngle(minAbs, maxAbs, arr[maxIndex])
        const currentAngle = findAngle(minAbs, maxAbs, arr[i])


        if (currentDistance > maxDistance || currentDistance == maxDistance && currentAngle > maxAngle) {
            maxDistance = currentDistance
            maxAngle = currentAngle
            maxIndex = i
        }
    }

    return arr[maxIndex]
}