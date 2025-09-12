// Visualizações de Dados com D3.js
class DataVisualization {
    constructor() {
        this.initializeStats();
        this.initializeChart();
        this.initializeTimeline();
    }
    
    initializeStats() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            const value = parseInt(item.dataset.value);
            const label = item.dataset.label;
            const vizContainer = item.querySelector('.stat-visualization');
            
            // Criar SVG para visualização
            const svg = d3.select(vizContainer)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', '0 0 100 100')
                .attr('preserveAspectRatio', 'xMidYMid meet');
            
            // Criar gradiente
            const gradient = svg.append('defs')
                .append('linearGradient')
                .attr('id', `gradient-${label.replace(/\s+/g, '-')}`)
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '100%');
            
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#1E90FF');
            
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#00BFFF');
            
            // Criar círculo de progresso
            const arc = d3.arc()
                .innerRadius(35)
                .outerRadius(45)
                .startAngle(0)
                .cornerRadius(5);
            
            const background = svg.append('path')
                .datum({endAngle: 2 * Math.PI})
                .style('fill', '#1a2a5a')
                .attr('d', arc)
                .attr('transform', 'translate(50,50)');
            
            const foreground = svg.append('path')
                .datum({endAngle: 0})
                .style('fill', `url(#gradient-${label.replace(/\s+/g, '-')})`)
                .attr('d', arc)
                .attr('transform', 'translate(50,50)');
            
            // Animar progresso
            const duration = 2000;
            const step = (timestamp) => {
                const progress = Math.min(1, (timestamp - start) / duration);
                const angle = progress * 2 * Math.PI * (value / 100);
                
                foreground.datum({endAngle: angle})
                    .attr('d', arc);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };
            
            const start = performance.now();
            requestAnimationFrame(step);
            
            // Adicionar número central
            const text = svg.append('text')
                .attr('x', 50)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('font-size', '24px')
                .style('font-weight', 'bold')
                .style('fill', '#1E90FF')
                .text('0');
            
            // Animar número
            d3.select(text.node())
                .transition()
                .duration(duration)
                .tween('text', function() {
                    const i = d3.interpolateNumber(0, value);
                    return function(t) {
                        this.textContent = Math.round(i(t)) + '+';
                    };
                });
        });
    }
    
    initializeChart() {
        const data = [
            { year: 2020, projects: 5 },
            { year: 2021, projects: 12 },
            { year: 2022, projects: 20 },
            { year: 2023, projects: 35 },
            { year: 2024, projects: 45 },
            { year: 2025, projects: 50 }
        ];
        
        const container = document.querySelector('.stats-chart');
        const margin = {top: 20, right: 20, bottom: 30, left: 40};
        const width = container.clientWidth - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;
        
        const svg = d3.select('.stats-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Escalas
        const x = d3.scaleLinear()
            .domain([2020, 2025])
            .range([0, width]);
        
        const y = d3.scaleLinear()
            .domain([0, 60])
            .range([height, 0]);
        
        // Linha
        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.projects))
            .curve(d3.curveMonotoneX);
        
        // Área
        const area = d3.area()
            .x(d => x(d.year))
            .y0(height)
            .y1(d => y(d.projects))
            .curve(d3.curveMonotoneX);
        
        // Gradiente
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'area-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#1E90FF')
            .attr('stop-opacity', 0.3);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#1E90FF')
            .attr('stop-opacity', 0);
        
        // Desenhar área
        svg.append('path')
            .datum(data)
            .attr('class', 'area')
            .attr('d', area)
            .style('fill', 'url(#area-gradient)')
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .style('opacity', 1);
        
        // Desenhar linha
        const path = svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', '#1E90FF')
            .attr('stroke-width', 2)
            .attr('d', line);
        
        // Animar linha
        const length = path.node().getTotalLength();
        path.attr('stroke-dasharray', length + ' ' + length)
            .attr('stroke-dashoffset', length)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
        
        // Pontos
        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.year))
            .attr('cy', d => y(d.projects))
            .attr('r', 0)
            .style('fill', '#1E90FF')
            .transition()
            .delay((d, i) => i * 300)
            .duration(500)
            .attr('r', 4);
        
        // Eixos
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format('d')))
            .style('color', '#6c757d');
        
        svg.append('g')
            .call(d3.axisLeft(y))
            .style('color', '#6c757d');
    }
    
    initializeTimeline() {
        const events = [
            { year: 2020, event: 'Fundação da Empresa' },
            { year: 2021, event: 'Primeiro Grande Cliente' },
            { year: 2022, event: 'Expansão da Equipe' },
            { year: 2023, event: 'Lançamento de Produtos' },
            { year: 2024, event: 'Expansão Nacional' },
            { year: 2025, event: 'Reconhecimento Internacional' }
        ];
        
        const container = document.querySelector('.stats-timeline');
        const timeline = d3.select('.stats-timeline')
            .append('div')
            .attr('class', 'timeline-container');
        
        const items = timeline.selectAll('.timeline-item')
            .data(events)
            .enter()
            .append('div')
            .attr('class', 'timeline-item')
            .style('opacity', 0)
            .style('transform', 'translateY(20px)');
        
        items.append('div')
            .attr('class', 'timeline-year')
            .text(d => d.year);
        
        items.append('div')
            .attr('class', 'timeline-content')
            .text(d => d.event);
        
        // Animar itens quando visíveis
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    d3.select(entry.target)
                        .transition()
                        .delay(index * 200)
                        .duration(800)
                        .style('opacity', 1)
                        .style('transform', 'translateY(0)');
                }
            });
        }, {
            threshold: 0.2
        });
        
        items.nodes().forEach(node => observer.observe(node));
    }
}

// Estilos para as visualizações
const style = document.createElement('style');
style.textContent = `
    .stat-visualization {
        width: 100px;
        height: 100px;
        margin: 0 auto 1rem;
    }
    
    .stats-details {
        margin-top: 3rem;
        padding: 2rem;
        background: var(--gradient-glass);
        border-radius: var(--border-radius-lg);
        border: var(--border-light);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }
    
    .stats-chart {
        height: 200px;
        margin-bottom: 2rem;
    }
    
    .stats-chart .line {
        filter: drop-shadow(0 0 8px rgba(30, 144, 255, 0.3));
    }
    
    .stats-chart .dot {
        filter: drop-shadow(0 0 4px rgba(30, 144, 255, 0.5));
    }
    
    .timeline-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .timeline-item {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        padding: 1rem;
        background: rgba(30, 144, 255, 0.05);
        border-radius: var(--border-radius);
        border: 1px solid rgba(30, 144, 255, 0.1);
        transition: var(--transition);
    }
    
    .timeline-item:hover {
        transform: translateX(10px);
        background: rgba(30, 144, 255, 0.1);
        border-color: var(--primary-blue);
    }
    
    .timeline-year {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-blue);
        min-width: 60px;
    }
    
    .timeline-content {
        color: var(--white);
        opacity: 0.9;
    }
    
    @media (max-width: 768px) {
        .stats-details {
            padding: 1rem;
        }
        
        .timeline-item {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .timeline-year {
            min-width: auto;
        }
    }
`;

document.head.appendChild(style);

// Inicializar visualizações quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new DataVisualization();
});
