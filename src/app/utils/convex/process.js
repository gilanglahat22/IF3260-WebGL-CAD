import { findPMax, isDeterminantPositive, quickSort } from "./utils.js"

const divideList = (arr, minAbs, maxAbs, flag) => {
    let leftSide = []
    let rightSide = []

    for (let i = 0; i < arr.length; i++) {
        if (((arr[i].position[0] > minAbs.position[0] || (arr[i].position[0] == minAbs.position[0] && arr[i].position[1] > minAbs.position[1])) 
        && (arr[i].position[0] < maxAbs.position[0] || (arr[i].position[0] == maxAbs.position[0] && arr[i].position[1] < maxAbs.position[1])))) {
            if (isDeterminantPositive(minAbs, maxAbs, arr[i])) {
                leftSide.push(arr[i])
            }
            if (!isDeterminantPositive(minAbs, maxAbs, arr[i])) {
                rightSide.push(arr[i])
            }
        }
    }

    if (flag > 0){
        return leftSide
    } else if (flag < 0) {
        return rightSide
    } else {
        return {
            left: leftSide,
            right: rightSide
        }
    }
}

const divideLeft = (arr, minAbs, maxAbs) => {
    if (arr.length == 0) {
        return []
    }

    const pMax = findPMax(arr, minAbs, maxAbs)
    const pMaxIdx = arr.indexOf(pMax)

    arr.splice(pMaxIdx, 1)

    const leftSide = divideLeft(divideList(arr, minAbs, pMax, 1), minAbs, pMax)
    leftSide.forEach((point) => {
        const idx = arr.indexOf(point)
        arr.splice(idx, 1)
    })

    const rightSide = divideLeft(divideList(arr, pMax, maxAbs, 1), pMax, maxAbs)
    rightSide.forEach((point) => {
        const idx = arr.indexOf(point)
        arr.splice(idx, 1)
    })

    return leftSide.concat([pMax]).concat(rightSide)
}

const divideRight = (arr, minAbs, maxAbs) => {
    if (arr.length == 0) {
        return []
    }

    const pMax = findPMax(arr, minAbs, maxAbs)
    const pMaxIdx = arr.indexOf(pMax)

    arr.splice(pMaxIdx, 1)

    const leftSide = divideLeft(divideList(arr, minAbs, pMax, -1), minAbs, pMax)
    leftSide.forEach((point) => {
        const idx = arr.indexOf(point)
        arr.splice(idx, 1)
    })

    const rightSide = divideLeft(divideList(arr, pMax, maxAbs, -1), pMax, maxAbs)
    rightSide.forEach((point) => {
        const idx = arr.indexOf(point)
        arr.splice(idx, 1)
    })

    return leftSide.concat([pMax]).concat(rightSide)
}

const mergeList = (leftRes, rightRes, minAbs, maxAbs) => {
    let mergedList = []

    leftRes = quickSort(leftRes)
    rightRes = quickSort(rightRes)

    mergedList.push(minAbs)
    leftRes.forEach((item) => mergedList.push(item))
    mergedList.push(maxAbs)
    rightRes.forEach((item) => mergedList.push(item))

    return mergedList
}

export const ConvexHull = (points) => {
    const arr = quickSort(points)

    const minAbs = arr[0]
    const maxAbs = arr[arr.length - 1]

    const res = divideList(arr.slice(1, arr.length - 1), minAbs, maxAbs, 0)

    const leftRes = divideLeft(res.left, minAbs, maxAbs)
    const rightRes = divideRight(res.right, minAbs, maxAbs)

    return mergeList(leftRes, rightRes, minAbs, maxAbs)
} 