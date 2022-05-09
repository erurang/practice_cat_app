// breadcrumb 에 div 자식마다 a - b - c 로 이어짐.
// "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public/${filePath}"

async function getRootData() {
    const data = await fetch("https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/")
    const jsonData = await data.json()
    return await jsonData
}

// 이런식으로 DOM에 직접 접근하는 방식을 명령적 프로그래밍 이라고함
// -> 추상적이지 못하다.
// -> 나중에 UI가 커질경우 어느지점 어느 시점에서 DOM을 업데이트 하는지 추적하는게 점점 힘들어짐

async function Nodes() {

    const data = await getRootData()
    console.log(data)

    const NodesContainer = document.querySelector(".Nodes")
    
    for(let i=0; i<data.length; i++) {

        const div = document.createElement('div')
        div.setAttribute("class","Node")
        const img = document.createElement('img')

        const nameDiv = document.createElement('div')
        nameDiv.innerText = data[i].name

        if(data[i].type === 'DIRECTORY') {
            img.src = "assets/directory.png"
        } else {
            img.src = "assets/file.png"
        }
        
        div.appendChild(img)
        div.appendChild(nameDiv)
        NodesContainer.appendChild(div)
    }

}

Nodes()