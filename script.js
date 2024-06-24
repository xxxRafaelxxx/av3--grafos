const nodes = ['A', 'B', 'C', 'D', 'E'];
const edges = [
    { from: 'A', to: 'B', distance: 20 }, // 2 -> 20
    { from: 'A', to: 'C', distance: 40 }, // 4 -> 40
    { from: 'B', to: 'C', distance: 10 }, // 1 -> 10
    { from: 'B', to: 'D', distance: 70 }, // 7 -> 70
    { from: 'C', to: 'E', distance: 30 }, // 3 -> 30
    { from: 'D', to: 'E', distance: 20 }  // 2 -> 20
];

window.onload = function() {
    const startSelect = document.getElementById('start');
    const endSelect = document.getElementById('end');

    nodes.forEach(node => {
        const optionStart = document.createElement('option');
        optionStart.value = node;
        optionStart.text = node;
        startSelect.add(optionStart);

        const optionEnd = document.createElement('option');
        optionEnd.value = node;
        optionEnd.text = node;
        endSelect.add(optionEnd);
    });

    drawGraph();
};

function drawGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const positions = {
        'A': { x: 150, y: 300 },
        'B': { x: 300, y: 150 },
        'C': { x: 300, y: 450 },
        'D': { x: 450, y: 150 },
        'E': { x: 450, y: 450 }
    };

    edges.forEach(edge => {
        const fromPos = positions[edge.from];
        const toPos = positions[edge.to];
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = '16px Segoe UI';
        ctx.fillStyle = '#333';
        ctx.fillText(edge.distance, (fromPos.x + toPos.x) / 2, (fromPos.y + toPos.y) / 2);
    });

    nodes.forEach(node => {
        const pos = positions[node];
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = '20px Segoe UI';
        ctx.fillText(node, pos.x - 7, pos.y + 7);
    });
}

function findShortestPath() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const shortestPath = dijkstra(start, end);
    alert(`A rota mais curta de ${start} para ${end} é: ${shortestPath.path.join(' -> ')} com distância ${shortestPath.distance}`);
}

function dijkstra(start, end) {
    const distances = {};
    const prev = {};
    const pq = new PriorityQueue();
    const nodesSet = new Set(nodes);

    nodes.forEach(node => {
        distances[node] = Infinity;
        prev[node] = null;
    });

    distances[start] = 0;
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
        const minNode = pq.dequeue().element;
        nodesSet.delete(minNode);

        if (minNode === end) break;

        edges.forEach(edge => {
            if (edge.from === minNode || edge.to === minNode) {
                const neighbor = edge.from === minNode ? edge.to : edge.from;
                const alt = distances[minNode] + edge.distance;

                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    prev[neighbor] = minNode;
                    pq.enqueue(neighbor, alt);
                }
            }
        });
    }

    const path = [];
    let u = end;
    while (prev[u] !== null) {
        path.unshift(u);
        u = prev[u];
    }
    path.unshift(start);

    return { path: path, distance: distances[end] };
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        const qElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                added = true;
                break;
            }
        }

        if (!added) this.items.push(qElement);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}
