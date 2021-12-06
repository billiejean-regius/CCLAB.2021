function  setup() {

  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-canvas");



}

function draw() {
  background(0, 0, 0, 0);
}

const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

let state = {}

function startGame() {
  state = {}
  showTextNode(1) //Starting text node
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  textElement.innerText = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

const textNodes = [
  {
    id: 1,
    text: '"Bang." "Bang." "Bang." The repeated crack of a white-knuckle fist rings out, stirring you from your deep slumber. ',
    options: [
      {
        text: 'Sleep',
        setState: { neutral: true },
        nextText: 2
      },
      {
        text: '',
        setState: { noOption: true },
      },
      {
        text: '',
        setState: { noOption: true },
      },
      {
        text: '',
        setState: { noOption: true },
      }
    ]
  },
  {
    id: 2,
    text: 'Brows furrowing, you curl tighter into the warmth of your covers, a sweet and pervasive darkness lulling you back to sleep.',
    options: [
      {
        text: 'Sleep',
        setState: { neutral: true },
        nextText: 3
      },
      {
        text: '',
        setState: { noOption: true },
      },
      {
        text: '',
        setState: { noOption: true },
      },
      {
        text: '',
        setState: { noOption: true },
      }
    ]
  },
  {
    id: 3,
    text: 'text. ',
    options: [
      {
        text: 'text',
        nextText: 4
      },
      {
        text: 'text',
        nextText: 5
      },
      {
        text: 'text',
        nextText: 6
      },
      {
        text: '',
        setState: { noOption: true },
      }
    ]
  },
  {
    id: 4,
    text: 'text.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 5,
    text: 'text.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 6,
    text: 'text.',
    options: [
      {
        text: 'text',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    text: 'text.',
    options: [
      {
        text: 'text',
        nextText: 8
      },
      {
        text: 'text',
        requiredState: (currentState) => currentState.event,
        nextText: 9
      },
      {
        text: 'text',
        requiredState: (currentState) => currentState.item,
        nextText: 10
      },
      {
        text: 'text',
        requiredState: (currentState) => currentState.event,
        nextText: 11
      }
    ]
  },
  {
    id: 8,
    text: 'text.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 9,
    text: 'text.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 10,
    text: 'text.',
    options: [
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
  {
    id: 11,
    text: 'text',
    options: [
      {
        text: 'text.',
        nextText: -1
      }
    ]
  }
]

startGame()
