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

const divideRec = (arr, minAbs, maxAbs, index) => {
    if (arr.length == 0) {
        return []
    }

    const pMax = findPMax(arr, minAbs, maxAbs)
    const pMaxIdx = arr.indexOf(pMax)
    arr.splice(pMaxIdx, 1)

    const leftSide = divideRec(divideList(arr, minAbs, pMax, index), minAbs, pMax, index)
    leftSide.forEach((point) => {
        const idx = arr.indexOf(point)
        arr.splice(idx, 1)
    })

    const rightSide = divideRec(divideList(arr, pMax, maxAbs, index), pMax, maxAbs, index)
    rightSide.forEach((point) => {
        const idx = arr.indexOf(point)
        arr.splice(idx, 1)
    })
    const res = leftSide.concat([pMax]).concat(rightSide)
    return res
}


export const ConvexHull = (points) => {
    if (points.length <= 1){
        return points
    }
    let temp = JSON.parse(JSON.stringify(points))
    const arr = quickSort(points)
    console.log(points)
    console.log("\n")
    const minAbs = arr[0]
    const maxAbs = arr[arr.length - 1]

    const res = divideList(arr.slice(1, arr.length - 1), minAbs, maxAbs, 0)


    const leftRes = quickSort(divideRec(res.left, minAbs, maxAbs, 1))
    const rightRes = quickSort(divideRec(res.right, minAbs, maxAbs, -1)).reverse()


    let tempRes = [minAbs].concat(leftRes, [maxAbs], rightRes)
    console.log(tempRes)
    tempRes.forEach((item) => {
        for (let i = 0; i < temp.length; i++){
            if (temp[i].position[0] == item.position[0] && temp[i].position[1] == item.position[1]) {
                temp.splice(i, 1)
            }
        }
    })

    console.log(temp)
    // tempRes = tem_) m61  DG KL
    tempRes = tempRes.concat(ConvexHull(temp))

    console.log(tempRes)

    return tempRes
} 