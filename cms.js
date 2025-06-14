document.addEventListener('DOMContentLoaded', () => {
  fetch('cms-content.json')
    .then(response => response.json())
    .then(data => renderCMSBlocks(data.blocks));
});

const contentFile = document.body.dataset.content || 'cms-content.json';

fetch(contentFile)
  .then(res => res.json())
  .then(data => {
    renderProjectCards(data.projects); // Assuming data.projects is an array of project objects
  });

const params = new URLSearchParams(window.location.search);
const projectFile = params.get('project') || 'default.json';

fetch(projectFile)
  .then(res => res.json())
  .then(data => {
    renderCMSBlocks(data.blocks); // or your render function
  });


fetch('cms-content.json')
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = ''; // Clear existing inner HTML

    data.projects.forEach(project => {
      const link = document.createElement('a');
      link.href = `cms.html?project=${project.slug}.json`;
      link.className = 'project-card';
      link.style.textDecoration = 'none';
      link.style.color = 'inherit';

      link.innerHTML = `
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" />
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
          <div class="project-meta">
            <span class="time">${project.time}</span>
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <p>${project.description}</p>
        </div>
      `;

      grid.appendChild(link);
    });
  })
  .catch(error => console.error('Error loading JSON:', error));


function renderCMSBlocks(blocks) {
  const container = document.getElementById('cms-content');
  container.innerHTML = '';

  blocks.forEach(block => {
    let el;
    switch (block.type) {
      case 'hero':
        el = renderHeroBlock(block);
        break;
      case 'rec':
        el = renderRecBlock(block);
        break;
        break;
        case 'cardgroup':
            el = renderCardGroupBlock(block);
            break;
      case 'instructions':
        el = renderInstructionsBlock(block);
        break;
      default:
        el = document.createElement('div');
        el.textContent = `Unknown block type: ${block.type}`;
    case 'instructionCarousel':
        el = renderInstructionCarouselBlock(block);
        break;

    }
    container.appendChild(el);
  });
}

// HERO block
function renderHeroBlock(block) {
  const div = document.createElement('div');
  div.className = block.class || 'hero';

  // Create text container
  const content = document.createElement('div');
  content.className = 'hero-text';

  const h1 = document.createElement('h1');
  h1.textContent = block.title;

  const p = document.createElement('p');
  p.textContent = block.subtitle;

  content.appendChild(h1);
  content.appendChild(p);

  // Tags
  if (block.tags && Array.isArray(block.tags)) {
  const group = {
    white: [],
    blue: [],
    label: null,
    description: null
  };

  // Separate tags into groups
  block.tags.forEach(tag => {
    if (tag.style === 'white-tag') {
      group.white.push(tag);
    } else if (tag.style === 'description-label') {
      group.description = tag.label;
    } else if (tag.style === 'section-label') {
      group.label = tag.label;
    } else {
      group.blue.push(tag);
    }
  });

  // White tags
  const whiteRow = document.createElement('div');
  whiteRow.className = 'project-meta';
  group.white.forEach(tag => {
    const span = document.createElement('span');
    span.className = tag.style;
    span.textContent = tag.label;
    whiteRow.appendChild(span);
  });
  content.appendChild(whiteRow);

  // Description
  if (group.description) {
    const p = document.createElement('p');
    p.className = 'description-label';
    p.textContent = group.description;
    content.appendChild(p);
  }

  // Section label
  if (group.label) {
    const h3 = document.createElement('h3');
    h3.textContent = group.label;
    h3.className = 'section-label';
    content.appendChild(h3);
  }

  // Blue tags
  const blueRow = document.createElement('div');
  blueRow.className = 'project-meta';
  group.blue.forEach(tag => {
    const span = document.createElement('span');
    span.className = tag.style || 'tag';
    span.textContent = tag.label;
    blueRow.appendChild(span);
  });
  content.appendChild(blueRow);
}




  // Image
  const imgContainer = document.createElement('div');
  imgContainer.className = 'hero-image';

  const img = document.createElement('img');
  img.src = block.image;
  img.alt = block.title;
  imgContainer.appendChild(img);

  // Layout logic
  if (block.layout === 'split') {
    div.appendChild(content);
    div.appendChild(imgContainer);
  } else {
    div.appendChild(h1);
    div.appendChild(p);
    div.appendChild(tagContainer);
    div.appendChild(img);
  }

  return div;
}


// REC block
function getDownloadSvg() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
  <path d="M5.05508 3.60039C4.68378 3.60039 4.32768 3.74789 4.06513 4.01044C3.80258 4.27299 3.65508 4.62909 3.65508 5.00039V11.0004C3.65508 11.7732 4.28228 12.4004 5.05508 12.4004H11.0551C11.4264 12.4004 11.7825 12.2529 12.045 11.9903C12.3076 11.7278 12.4551 11.3717 12.4551 11.0004V9.40039C12.4551 9.24126 12.5183 9.08865 12.6308 8.97613C12.7433 8.86361 12.8959 8.80039 13.0551 8.80039C13.2142 8.80039 13.3668 8.86361 13.4793 8.97613C13.5919 9.08865 13.6551 9.24126 13.6551 9.40039V11.0004C13.6551 11.69 13.3812 12.3513 12.8936 12.8389C12.406 13.3265 11.7446 13.6004 11.0551 13.6004H5.05508C4.36552 13.6004 3.7042 13.3265 3.2166 12.8389C2.72901 12.3513 2.45508 11.69 2.45508 11.0004V5.00039C2.45508 4.31083 2.72901 3.64951 3.2166 3.16191C3.7042 2.67432 4.36552 2.40039 5.05508 2.40039H6.65508C6.81421 2.40039 6.96682 2.4636 7.07934 2.57613C7.19186 2.68865 7.25508 2.84126 7.25508 3.00039C7.25508 3.15952 7.19186 3.31213 7.07934 3.42465C6.96682 3.53718 6.81421 3.60039 6.65508 3.60039H5.05508ZM8.45508 3.00039C8.45508 2.84126 8.51829 2.68865 8.63081 2.57613C8.74334 2.4636 8.89595 2.40039 9.05508 2.40039H13.0551C13.2142 2.40039 13.3668 2.4636 13.4793 2.57613C13.5919 2.68865 13.6551 2.84126 13.6551 3.00039V7.00039C13.6551 7.15952 13.5919 7.31213 13.4793 7.42465C13.3668 7.53718 13.2142 7.60039 13.0551 7.60039C12.8959 7.60039 12.7433 7.53718 12.6308 7.42465C12.5183 7.31213 12.4551 7.15952 12.4551 7.00039V4.44839L9.47908 7.42439C9.42415 7.48334 9.35791 7.53062 9.28431 7.56342C9.21071 7.59621 9.13126 7.61384 9.0507 7.61526C8.97013 7.61669 8.89011 7.60187 8.8154 7.57169C8.74069 7.54151 8.67282 7.4966 8.61585 7.43962C8.55887 7.38265 8.51396 7.31478 8.48378 7.24007C8.4536 7.16536 8.43878 7.08534 8.4402 7.00477C8.44163 6.92421 8.45926 6.84476 8.49205 6.77116C8.52485 6.69756 8.57213 6.63132 8.63108 6.57639L11.6071 3.60039H9.05508C8.89595 3.60039 8.74334 3.53718 8.63081 3.42465C8.51829 3.31213 8.45508 3.15952 8.45508 3.00039Z" fill="white"/>
</svg>
  `;
}

function renderCardGroupBlock(block) {
  const section = document.createElement('section');
  section.className = block.class || 'rec-grid-blue';

  const heading = document.createElement('h2');
  heading.textContent = block.heading;

  const grid = document.createElement('div');
  grid.className = 'rec-grid';

  block.cards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'rec-card';

    const title = document.createElement('h3');
    title.textContent = card.title;

    const img = document.createElement('img');
    img.src = card.image;
    img.alt = card.title;

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    card.buttons.forEach(btn => {
      const a = document.createElement('a');
      a.href = btn.link;
      a.className = 'btn';
      a.target = '_blank';
      a.innerHTML = `${getDownloadSvg()}<span>${btn.label}</span>`;
      buttonGroup.appendChild(a);
    });

    div.appendChild(title);
    div.appendChild(img);
    div.appendChild(buttonGroup);
    grid.appendChild(div);
  });

  section.appendChild(heading);
  section.appendChild(grid);
  return section;
}





function renderInstructionCarouselBlock(block) {
  const section = document.createElement('section');
  section.className = 'instruction-carousel';

  const heading = document.createElement('h2');
  heading.textContent = block.heading;
  section.appendChild(heading);

  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'scroll-track';

  block.images.forEach((imgPath, i) => {
    const img = document.createElement('img');
    img.src = imgPath;
    img.alt = `Instruction ${i + 1}`;
    img.className = 'instruction-image';
    scrollContainer.appendChild(img);
  });

  section.appendChild(scrollContainer);
  return section;
}

