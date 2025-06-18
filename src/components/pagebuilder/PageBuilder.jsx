import React, { useState } from 'react';
import '../../styles/pagebuilder/style.css';
import {
    FaPlus,
    FaTableColumns,
    FaLayerGroup,
    FaShieldHalved,
    FaRegFileLines,
    FaRegStarHalfStroke,
    FaRegFontAwesome,
    FaRegSquare,
    FaRegImage,
    FaMinus,
    FaRegSquareMinus,
    FaRegObjectGroup,
    FaGripLines,
    FaRegClone,
    FaHeading,
    FaListUl,
    FaRegImages,
    FaRegCirclePlay,
    FaRegStar,
    FaParagraph,
    FaChevronDown,
    FaChevronRight,
    FaQuestion,
    FaDoorOpen,
    FaGear,
    FaDesktop,
    FaTabletScreenButton,
    FaMobileScreen,
    FaArrowRotateLeft,
    FaArrowRotateRight,
    FaFloppyDisk,
    FaRegEye,
    FaEyeSlash,
    FaCheck,
    FaLink,
    FaWandMagic,
    FaFill,
    FaBorderAll
  } from 'react-icons/fa6';

const elementTypes = {
    basic: [
      { id: 'text', name: 'Text', icon: <FaRegFontAwesome />, category: 'basic', defaultContent: 'Voeg uw tekst hier toe' },
      { id: 'button', name: 'Button', icon: <FaRegSquare />, category: 'basic', defaultContent: 'Klik hier' },
      { id: 'image', name: 'Afbeelding', icon: <FaRegImage />, category: 'basic', defaultContent: '' },
      { id: 'divider', name: 'Scheiding', icon: <FaMinus />, category: 'basic', defaultContent: '' },
      { id: 'spacer', name: 'Ruimte', icon: <FaRegSquareMinus />, category: 'basic', defaultContent: '' },
    ],
    layout: [
      { id: 'container', name: 'Container', icon: < FaRegObjectGroup />, category: 'layout', defaultContent: '' },
      { id: 'column', name: 'Kolom', icon: < FaTableColumns />, category: 'layout', defaultContent: '' },
      { id: 'row', name: 'Rij', icon: < FaGripLines />, category: 'layout', defaultContent: '' },
      { id: 'section', name: 'Sectie', icon: < FaRegClone />, category: 'layout', defaultContent: '' },
    ],
    typography: [
      { id: 'heading', name: 'Kop', icon: < FaHeading />, category: 'typography', defaultContent: 'Uw kop hier' },
      { id: 'paragraph', name: 'Paragraaf', icon: < FaParagraph />, category: 'typography', defaultContent: 'Uw paragraaf tekst hier' },
      { id: 'list', name: 'Lijst', icon: < FaListUl />, category: 'typography', defaultContent: 'Lijst item' },
    ],
    media: [
      { id: 'gallery', name: 'Galerij', icon: < FaRegImages />, category: 'media', defaultContent: '' },
      { id: 'video', name: 'Video', icon: < FaRegCirclePlay />, category: 'media', defaultContent: '' },
      { id: 'icon', name: 'Pictogram', icon: < FaRegStar />, category: 'media', defaultContent: '' },
    ],
  };

const blockTypes = {
  hero: [
    { id: 'hero-1', name: 'Hero met Afbeelding', category: 'hero', preview: 'Hero sectie met achtergrondafbeelding en call-to-action' },
    { id: 'hero-2', name: 'Hero met Video', category: 'hero', preview: 'Hero sectie met achtergrondvideo' },
  ],
  content: [
    { id: 'content-1', name: 'Twee Kolommen Layout', category: 'content', preview: 'Twee kolommen content layout' },
    { id: 'content-2', name: 'Drie Kolommen Layout', category: 'content', preview: 'Drie kolommen content layout' },
  ],
  testimonials: [
    { id: 'testimonial-1', name: 'Enkele Testimonial', category: 'testimonials', preview: 'Enkele testimonial met foto en quote' },
    { id: 'testimonial-2', name: 'Testimonial Grid', category: 'testimonials', preview: 'Grid van meerdere testimonials' },
  ],
};

function getElementTypeById(id) {
  for (const group of Object.values(elementTypes)) {
    for (const el of group) {
      if (el.id === id) return el;
    }
  }
  return null;
}

// Helper: insert element at index in array
function insertAt(arr, index, item) {
  return [...arr.slice(0, index), item, ...arr.slice(index)];
}

// Helper: insert element in tree at targetId & position (before/after/inside) & index
function insertElementInTree(elements, targetId, newElement, position = 'after', childIndex = null) {
  let result = [];
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (el.id === targetId) {
      if (position === 'before') {
        result.push(newElement);
        result.push(el);
      } else if (position === 'after') {
        result.push(el);
        result.push(newElement);
      } else if (position === 'inside') {
        let children = el.children || [];
        if (childIndex !== null) {
          children = insertAt(children, childIndex, newElement);
        } else {
          children = [...children, newElement];
        }
        result.push({ ...el, children });
      }
    } else if (el.children) {
      result.push({ ...el, children: insertElementInTree(el.children, targetId, newElement, position, childIndex) });
    } else {
      result.push(el);
    }
  }
  return result;
}

// 1. Upgrade blocks naar echte samengestelde layouts
function createBlockChildren(block, nextId) {
  switch (block.id) {
    case 'hero-1':
      // Hero: Container > Row > 2 Columns (img, content)
      return [
        {
          id: `el_${nextId + 1}`,
          type: 'container',
          name: 'Hero Container',
          children: [
            {
              id: `el_${nextId + 2}`,
              type: 'row',
              name: 'Hero Row',
              children: [
                {
                  id: `el_${nextId + 3}`,
                  type: 'column',
                  name: 'Afbeelding Kolom',
                  children: [
                    {
                      id: `el_${nextId + 4}`,
                      type: 'image',
                      name: 'Hero Afbeelding',
                      src: '',
                      width: 320,
                      height: 220,
                      radius: 12,
                    },
                  ],
                },
                {
                  id: `el_${nextId + 5}`,
                  type: 'column',
                  name: 'Content Kolom',
                  children: [
                    {
                      id: `el_${nextId + 6}`,
                      type: 'heading',
                      name: 'Hero Titel',
                      content: 'Welkom bij onze geweldige service',
                    },
                    {
                      id: `el_${nextId + 7}`,
                      type: 'paragraph',
                      name: 'Hero Subtitel',
                      content: 'Ontdek hoe wij uw bedrijf naar nieuwe hoogten kunnen brengen met onze innovatieve oplossingen.',
                    },
                    {
                      id: `el_${nextId + 8}`,
                      type: 'button',
                      name: 'Hero Button',
                      content: 'Aan de slag',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
    case 'hero-2':
      // Hero-2: Container > Row > 2 Columns (video, content)
      return [
        {
          id: `el_${nextId + 1}`,
          type: 'container',
          name: 'Hero Video Container',
          children: [
            {
              id: `el_${nextId + 2}`,
              type: 'row',
              name: 'Hero Video Row',
              children: [
                {
                  id: `el_${nextId + 3}`,
                  type: 'column',
                  name: 'Video Kolom',
                  children: [
                    {
                      id: `el_${nextId + 4}`,
                      type: 'video',
                      name: 'Hero Video',
                      content: '',
                    },
                  ],
                },
                {
                  id: `el_${nextId + 5}`,
                  type: 'column',
                  name: 'Content Kolom',
                  children: [
                    {
                      id: `el_${nextId + 6}`,
                      type: 'heading',
                      name: 'Hero Titel',
                      content: 'Welkom bij onze video hero',
                    },
                    {
                      id: `el_${nextId + 7}`,
                      type: 'paragraph',
                      name: 'Hero Tekst',
                      content: 'Bekijk onze introductievideo hieronder.',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
    case 'content-1':
      // Twee kolommen layout: Container > Row > 2 Columns (text, image)
      return [
        {
          id: `el_${nextId + 1}`,
          type: 'container',
          name: 'Content Container',
          children: [
            {
              id: `el_${nextId + 2}`,
              type: 'row',
              name: 'Content Row',
              children: [
                {
                  id: `el_${nextId + 3}`,
                  type: 'column',
                  name: 'Tekst Kolom',
                  children: [
                    {
                      id: `el_${nextId + 4}`,
                      type: 'heading',
                      name: 'Content Titel',
                      content: 'Twee kolommen layout',
                    },
                    {
                      id: `el_${nextId + 5}`,
                      type: 'paragraph',
                      name: 'Content Tekst',
                      content: 'Dit is een voorbeeld van een layout met twee kolommen.',
                    },
                  ],
                },
                {
                  id: `el_${nextId + 6}`,
                  type: 'column',
                  name: 'Afbeelding Kolom',
                  children: [
                    {
                      id: `el_${nextId + 7}`,
                      type: 'image',
                      name: 'Content Afbeelding',
                      src: '',
                      width: 240,
                      height: 180,
                      radius: 8,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
    case 'content-2':
      // Drie kolommen layout: Container > Row > 3 Columns (text, image, button)
      return [
        {
          id: `el_${nextId + 1}`,
          type: 'container',
          name: 'Content3 Container',
          children: [
            {
              id: `el_${nextId + 2}`,
              type: 'row',
              name: 'Content3 Row',
              children: [
                {
                  id: `el_${nextId + 3}`,
                  type: 'column',
                  name: 'Kolom 1',
                  children: [
                    {
                      id: `el_${nextId + 4}`,
                      type: 'heading',
                      name: 'Kolom 1 Titel',
                      content: 'Kolom 1',
                    },
                  ],
                },
                {
                  id: `el_${nextId + 5}`,
                  type: 'column',
                  name: 'Kolom 2',
                  children: [
                    {
                      id: `el_${nextId + 6}`,
                      type: 'image',
                      name: 'Kolom 2 Afbeelding',
                      src: '',
                      width: 120,
                      height: 120,
                      radius: 8,
                    },
                  ],
                },
                {
                  id: `el_${nextId + 7}`,
                  type: 'column',
                  name: 'Kolom 3',
                  children: [
                    {
                      id: `el_${nextId + 8}`,
                      type: 'button',
                      name: 'Kolom 3 Knop',
                      content: 'Klik hier',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
    case 'testimonial-1':
      // Testimonial: Container > Row > 1 Column (image, text)
      return [
        {
          id: `el_${nextId + 1}`,
          type: 'container',
          name: 'Testimonial Container',
          children: [
            {
              id: `el_${nextId + 2}`,
              type: 'row',
              name: 'Testimonial Row',
              children: [
                {
                  id: `el_${nextId + 3}`,
                  type: 'column',
                  name: 'Testimonial Kolom',
                  children: [
                    {
                      id: `el_${nextId + 4}`,
                      type: 'image',
                      name: 'Testimonial Afbeelding',
                      src: '',
                      width: 64,
                      height: 64,
                      radius: 32,
                    },
                    {
                      id: `el_${nextId + 5}`,
                      type: 'paragraph',
                      name: 'Testimonial Tekst',
                      content: '"Dit is een geweldige service!"',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
    case 'testimonial-2':
      // Testimonial grid: Container > Row > 2 Columns (elk met image + text)
      return [
        {
          id: `el_${nextId + 1}`,
          type: 'container',
          name: 'TestimonialGrid Container',
          children: [
            {
              id: `el_${nextId + 2}`,
              type: 'row',
              name: 'TestimonialGrid Row',
              children: [
                {
                  id: `el_${nextId + 3}`,
                  type: 'column',
                  name: 'Testimonial Kolom 1',
                  children: [
                    {
                      id: `el_${nextId + 4}`,
                      type: 'image',
                      name: 'Testimonial 1 Afbeelding',
                      src: '',
                      width: 64,
                      height: 64,
                      radius: 32,
                    },
                    {
                      id: `el_${nextId + 5}`,
                      type: 'paragraph',
                      name: 'Testimonial 1 Tekst',
                      content: '"Fantastisch product!"',
                    },
                  ],
                },
                {
                  id: `el_${nextId + 6}`,
                  type: 'column',
                  name: 'Testimonial Kolom 2',
                  children: [
                    {
                      id: `el_${nextId + 7}`,
                      type: 'image',
                      name: 'Testimonial 2 Afbeelding',
                      src: '',
                      width: 64,
                      height: 64,
                      radius: 32,
                    },
                    {
                      id: `el_${nextId + 8}`,
                      type: 'paragraph',
                      name: 'Testimonial 2 Tekst',
                      content: '"Zeer tevreden klant!"',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
    default:
      return [];
  }
}

const PageBuilder = () => {
  const [activePanel, setActivePanel] = useState('elements');
  const [device, setDevice] = useState('desktop');
  const [canvasElements, setCanvasElements] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [propTab, setPropTab] = useState('style');
  const TABS = [
    { id: 'style', icon: <FaWandMagic /> },
    { id: 'background', icon: <FaFill /> },
    { id: 'border', icon: <FaBorderAll /> }
  ];
  // Collapsible state for element and block categories
  const [openElementCategories, setOpenElementCategories] = useState({ basic: true, layout: false, typography: false, media: false });
  const [openBlockCategories, setOpenBlockCategories] = useState({ hero: true, content: false, testimonials: false });
  const [selectedElementId, setSelectedElementId] = useState(null);
  // Undo/redo state
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Contextmenu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, elementId: null });
  // Clipboard state
  const [clipboard, setClipboard] = useState(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedElement: null,
    dropTarget: null,
    dropPosition: null,
    dropParentId: null,
    dropIndex: null,
    previewPosition: { x: 0, y: 0 }
  });
  // Panel open/close state
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  // Voeg draggedElementId toe aan state
  const [draggedElementId, setDraggedElementId] = useState(null);
  // Voeg dragType toe aan state
  const [dragType, setDragType] = useState(null); // 'new' | 'move' | null
  // State voor open/dicht in layers drawer
  const [openLayers, setOpenLayers] = useState({});
  // 1. Drag & drop in layers drawer: index-based
  const [draggedLayerId, setDraggedLayerId] = useState(null);
  // 2. Drop-indicator alleen binnen canvas, volgt muis en element
  const [canvasDropIndicator, setCanvasDropIndicator] = useState(null);
  // Add new drag and drop state variables
  const [draggedElement, setDraggedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState(null);
  // Enhanced drag and drop state
  const [dropIndicator, setDropIndicator] = useState(null);
  const [containerDragOver, setContainerDragOver] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const [insertionPoint, setInsertionPoint] = useState(null);
  const [dragGhost, setDragGhost] = useState(null);
  const [canvasHover, setCanvasHover] = useState(null);

  // Helper: vind parent element van een element
  const findParentElement = (elementId, elements = canvasElements) => {
    for (const el of elements) {
      if (el.children) {
        if (el.children.some(child => child.id === elementId)) {
          return el;
        }
        const found = findParentElement(elementId, el.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper: update element in tree
  const updateElementInTree = (elements, elementId, updater) => {
    return elements.map(el => {
      if (el.id === elementId) {
        return updater(el);
      }
      if (el.children) {
        return {
          ...el,
          children: updateElementInTree(el.children, elementId, updater)
        };
      }
      return el;
    });
  };

  // Helper: verwijder element uit tree (en return het verwijderde element)
  const removeElementAndReturn = (elements, elementId) => {
    let removed = null;
    const filtered = elements.filter(el => {
      if (el.id === elementId) {
        removed = el;
        return false;
      }
      if (el.children) {
        const [newChildren, childRemoved] = removeElementAndReturn(el.children, elementId);
        if (childRemoved) removed = childRemoved;
        el.children = newChildren;
      }
      return true;
    });
    return [filtered, removed];
  };

  // Helper: voeg element toe op specifieke plek
  const insertElementAt = (elements, targetId, newElement, position = 'after') => {
    let inserted = false;
    const result = [];
    for (let el of elements) {
      if (el.id === targetId && position === 'before') {
        result.push(newElement);
        inserted = true;
      }
      result.push(el);
      if (el.id === targetId && position === 'after') {
        result.push(newElement);
        inserted = true;
      }
      if (el.children) {
        el.children = insertElementAt(el.children, targetId, newElement, position);
      }
      if (el.id === targetId && position === 'inside') {
        if (!el.children) el.children = [];
        el.children.push(newElement);
        inserted = true;
      }
    }
    if (!inserted && position === 'after' && targetId == null) {
      result.push(newElement);
    }
    return result;
  };

  // Helper: zoek element (ook in children)
  const findElementById = (id, elements = canvasElements) => {
    for (const el of elements) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElementById(id, el.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper: save state to history
  const saveState = (elements, selectedId) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ elements, selectedId });
    // Max 50 stappen
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Call saveState whenever canvasElements or selectedElementId changes
  React.useEffect(() => {
    saveState(canvasElements, selectedElementId);
    // eslint-disable-next-line
  }, [canvasElements, selectedElementId]);

  // Undo/redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setCanvasElements(prev.elements);
      setSelectedElementId(prev.selectedId);
      setHistoryIndex(historyIndex - 1);
    }
  };
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setCanvasElements(next.elements);
      setSelectedElementId(next.selectedId);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Click to add handler
  const handleElementClick = (element) => {
    const newElement = {
      id: `el_${nextId}`,
      type: element.id,
      name: element.name,
      content: element.defaultContent || '',
    };

    if (selectedElementId) {
      const selectedElement = findElementById(selectedElementId);
      if (selectedElement?.type === 'container') {
        // Voeg toe aan container
        setCanvasElements(prev => {
          const updated = insertElementAt(
            prev,
            selectedElementId,
            newElement,
            'inside'
          );
          return updated;
        });
      } else {
        // Voeg toe na geselecteerd element
        setCanvasElements(prev => {
          const updated = insertElementAt(
            prev,
            selectedElementId,
            newElement,
            'after'
          );
          return updated;
        });
      }
    } else {
      // Voeg toe aan einde
      setCanvasElements(prev => [...prev, newElement]);
    }

    setNextId(id => id + 1);
  };

  const handleBlockClick = (block) => {
    const children = createBlockChildren(block, nextId);
    const newBlock = {
      id: `block_${nextId}`,
      type: block.id,
      name: block.name,
      content: block.preview || '',
      children,
    };

    if (selectedElementId) {
      const selectedElement = findElementById(selectedElementId);
      if (selectedElement?.type === 'container') {
        // Voeg toe aan container
        setCanvasElements(prev => {
          const updated = insertElementAt(
            prev,
            selectedElementId,
            newBlock,
            'inside'
          );
          return updated;
        });
      } else {
        // Voeg toe na geselecteerd element
        setCanvasElements(prev => {
          const updated = insertElementAt(
            prev,
            selectedElementId,
            newBlock,
            'after'
          );
          return updated;
        });
      }
    } else {
      // Voeg toe aan einde
      setCanvasElements(prev => [...prev, newBlock]);
    }

    setNextId(id => id + 4); // 1 voor blok, 3 voor children
  };

  // Enhanced sidebar drag start
  const handleSidebarElementDragStart = (e, element) => {
    const dragData = {
      ...element,
      type: 'element',
      isExisting: false
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    
    setDraggedElement(dragData);
    setIsDragging(true);
    
    // Create drag preview
    createDragPreview(e, element.name, element.icon);
  };

  const handleSidebarBlockDragStart = (e, block) => {
    const dragData = {
      ...block,
      type: 'block',
      isExisting: false
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    
    setDraggedElement(dragData);
    setIsDragging(true);
    
    // Create drag preview
    createDragPreview(e, block.name, '📦');
  };

  // Enhanced canvas element drag start
  const handleCanvasElementDragStart = (e, el) => {
    e.stopPropagation();
    
    const dragData = {
      ...el,
      isExisting: true
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    setDraggedElement(dragData);
    setIsDragging(true);
    setDraggedElementId(el.id);
    
    // Create drag preview
    const elementType = getElementTypeById(el.type);
    createDragPreview(e, el.name, elementType?.icon || '📄');
  };


  // Enhanced canvas drag over
  const handleCanvasEmptyDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDragging) return;
    
    // Show canvas as active drop zone
    e.currentTarget.setAttribute('data-drag-active', 'true');
  };


  // Enhanced canvas drop
  const handleCanvasEmptyDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    e.currentTarget.setAttribute('data-drag-active', 'false');
    
    const dragData = e.dataTransfer.getData('application/json');
    if (!dragData) return;
    
    const droppedData = JSON.parse(dragData);
    
    if (droppedData.isExisting) {
      // Moving existing element to end of canvas
      moveElement(droppedData.id, null, 'end');
    } else {
      // Adding new element to end of canvas
      addNewElement(droppedData, null, 'end');
    }
    
    setDraggedElement(null);
    setIsDragging(false);
    setInsertionPoint(null);
  };

  // Enhanced drag end with cleanup
  const handleCanvasElementDragEnd = (e) => {
    // Clean up all drag states
    setDraggedElement(null);
    setIsDragging(false);
    setDropTarget(null);
    setInsertionPoint(null);
    setContainerDragOver(null);
    setDraggedElementId(null);
    
    // Clean up canvas drag state
    const canvas = document.getElementById('canvasContent');
    if (canvas) {
      canvas.setAttribute('data-drag-active', 'false');
    }
    
    // Clean up any drag active states
    document.querySelectorAll('[data-drag-over="true"]').forEach(el => {
      el.removeAttribute('data-drag-over');
    });
  };

  // Render drop preview
  const renderDropPreview = () => {
    if (!dragState.isDragging || !dragState.dropTarget) return null;

    const target = findElementById(dragState.dropTarget);
    if (!target) return null;

    const previewStyle = {
      position: 'absolute',
      left: dragState.previewPosition.x,
      top: dragState.previewPosition.y,
      pointerEvents: 'none',
      zIndex: 1000,
      opacity: 0.7,
      background: '#21808d',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
    };

    return (
      <div style={previewStyle}>
        {dragState.dropPosition === 'before' && 'Plaats hierboven'}
        {dragState.dropPosition === 'after' && 'Plaats hieronder'}
        {dragState.dropPosition === 'inside' && 'Plaats in container'}
      </div>
    );
  };

  // Render drop zones
  const renderDropZones = (el) => {
    if (!dragState.isDragging) return null;

    const isContainer = el.type === 'container';
    const zones = [];

    // Boven zone
    zones.push(
      <div
        key="before"
        className="drop-zone drop-zone--before"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: dragState.dropTarget === el.id && dragState.dropPosition === 'before' ? 'rgba(33, 128, 141, 0.1)' : 'transparent',
          borderTop: dragState.dropTarget === el.id && dragState.dropPosition === 'before' ? '2px solid #21808d' : 'none',
          pointerEvents: 'none',
        }}
      />
    );

    // Onder zone
    zones.push(
      <div
        key="after"
        className="drop-zone drop-zone--after"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: dragState.dropTarget === el.id && dragState.dropPosition === 'after' ? 'rgba(33, 128, 141, 0.1)' : 'transparent',
          borderBottom: dragState.dropTarget === el.id && dragState.dropPosition === 'after' ? '2px solid #21808d' : 'none',
          pointerEvents: 'none',
        }}
      />
    );

    // Container zone
    if (isContainer) {
      zones.push(
        <div
          key="inside"
          className="drop-zone drop-zone--inside"
          style={{
            position: 'absolute',
            top: '25%',
            left: 0,
            right: 0,
            bottom: '25%',
            background: dragState.dropTarget === el.id && dragState.dropPosition === 'inside' ? 'rgba(33, 128, 141, 0.1)' : 'transparent',
            border: dragState.dropTarget === el.id && dragState.dropPosition === 'inside' ? '2px dashed #21808d' : 'none',
            pointerEvents: 'none',
          }}
        />
      );
    }

    return zones;
  };

  // Collapsible logic
  const toggleElementCategory = (cat) => {
    setOpenElementCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };
  const toggleBlockCategory = (cat) => {
    setOpenBlockCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Selectie logica
  const handleCanvasElementClick = (id, e) => {
    e.stopPropagation();
    setSelectedElementId(id);
  };
  const handleCanvasClick = (e) => {
    if (e.target.classList.contains('canvas-content')) {
      setSelectedElementId(null);
    }
  };

  // Properties panel logica
  const selectedElement = findElementById(selectedElementId);
  const handlePropertyChange = (prop, value) => {
    const updateRecursive = (elements) =>
      elements.map(el => {
        if (el.id === selectedElementId) {
          return { ...el, [prop]: value };
        }
        if (el.children) {
          return { ...el, children: updateRecursive(el.children) };
        }
        return el;
      });
    setCanvasElements(els => updateRecursive(els));
  };

  // Contextmenu handlers
  const handleContextMenu = (e, elId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, elementId: elId });
  };
  const handleContextMenuClose = () => setContextMenu({ visible: false, x: 0, y: 0, elementId: null });

  // Verwijderen
  const handleDeleteElement = (id) => {
    setCanvasElements(els => els.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
    handleContextMenuClose();
  };

  // Inline content edit
  const handleInlineContentEdit = (el, value) => {
    setCanvasElements(els => els.map(item =>
      item.id === el.id ? { ...item, content: value } :
      // update child if block
      (item.children ? { ...item, children: item.children.map(child => child.id === el.id ? { ...child, content: value } : child) } : item)
    ));
  };

  // Render child element (for blocks)
  const renderChildElement = (el) => {
    const type = getElementTypeById(el.type);
    switch (el.type) {
      case 'text':
      case 'paragraph':
        return (
          <p
            key={el.id}
            contentEditable
            suppressContentEditableWarning
            className="canvas-element-child"
            style={{ ...getElementStyle(el), margin: '8px 0', background: 'none', border: 'none' }}
            onBlur={e => handleInlineContentEdit(el, e.target.textContent)}
            onClick={e => { e.stopPropagation(); setSelectedElementId(el.id); }}
          >{el.content}</p>
        );
      case 'heading':
        return (
          <h2
            key={el.id}
            contentEditable
            suppressContentEditableWarning
            className="canvas-element-child"
            style={{ ...getElementStyle(el), margin: '8px 0', background: 'none', border: 'none' }}
            onBlur={e => handleInlineContentEdit(el, e.target.textContent)}
            onClick={e => { e.stopPropagation(); setSelectedElementId(el.id); }}
          >{el.content}</h2>
        );
      case 'button':
        return (
          <button key={el.id} className="canvas-element-child" style={{ ...getElementStyle(el), margin: '8px 0', padding: '12px 32px', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(33,128,141,0.08)' }}
            onClick={e => { e.stopPropagation(); setSelectedElementId(el.id); }}
          >{el.content}</button>
        );
      case 'image':
        return (
          <div key={el.id} className="canvas-element-child" style={{ margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={e => { e.stopPropagation(); setSelectedElementId(el.id); }}>
            {el.src ? (
              <img src={el.src} alt={el.name} style={getElementStyle(el)} />
            ) : (
              <div style={{ minHeight: 120, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1.5px dashed #bbb', width: el.width || 320, height: el.height || 180 }}>
                <span style={{ color: '#bbb', fontSize: 32 }}>🖼</span>
              </div>
            )}
          </div>
        );
      case 'divider':
        return <hr key={el.id} className="canvas-element-child" style={{ margin: '24px 0', border: 'none', borderTop: '2px solid #e0e0e0' }} onClick={e => { e.stopPropagation(); setSelectedElementId(el.id); }} />;
      case 'spacer':
        return <div key={el.id} className="canvas-element-child" style={{ height: 40 }} onClick={e => { e.stopPropagation(); setSelectedElementId(el.id); }} />;
      default:
        return <div key={el.id} className="canvas-element-child" onClick={e => { e.stopPropagation(); setSelectedElementId(el.id); }}>{el.content}</div>;
    }
  };

  // Helper: bepaal drop-index bij drag-over
  const getDropIndex = (parent, overId, pos) => {
    if (!parent || !parent.children) return 0;
    const idx = parent.children.findIndex(child => child.id === overId);
    if (pos === 'before') return idx;
    if (pos === 'after') return idx + 1;
    if (pos === 'inside') return parent.children.length;
    return 0;
  };

  // Helper: render drop-zone voor canvas (parent, index)
  const renderDropZone = (parentId, index) => (
    <div
      className="canvas-drop-zone"
      onDragOver={e => {
        e.preventDefault();
        const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
        if (!canvasRect) return;
        setCanvasDropIndicator({
          left: 0,
          top: e.currentTarget.offsetTop,
          width: '100%',
          height: 4,
          type: 'line',
        });
        setDragState(prev => ({
          ...prev,
          dropTarget: null,
          dropPosition: 'between',
          dropParentId: parentId,
          dropIndex: index,
          isDragging: true
        }));
      }}
      onDrop={e => {
        e.preventDefault();
        setCanvasDropIndicator(null);
        if (dragType === 'move') {
          if (!draggedElementId) return;
          setCanvasElements(prev => {
            let [withoutDragged, dragged] = removeElementAndReturn(prev, draggedElementId);
            if (!dragged) return prev;
            return insertElementAtIndex(withoutDragged, parentId, index, dragged);
          });
          setDraggedElementId(null);
        }
        if (dragType === 'new') {
          const data = e.dataTransfer.getData('application/json');
          if (!data) return;
          const dropped = JSON.parse(data);
          let newElement;
          if (dropped.type === 'element') {
            newElement = {
              id: `el_${nextId}`,
              type: dropped.id,
              name: dropped.name,
              content: dropped.defaultContent || '',
            };
          } else if (dropped.type === 'block') {
            const children = createBlockChildren(dropped, nextId);
            newElement = {
              id: `block_${nextId}`,
              type: dropped.id,
              name: dropped.name,
              content: dropped.preview || '',
              children,
            };
          }
          setCanvasElements(prev => insertElementAtIndex(prev, parentId, index, newElement));
          setNextId(id => id + (dropped.type === 'block' ? 9 : 1));
        }
        setDragType(null);
        setDragState({ isDragging: false, draggedElement: null, dropTarget: null, dropPosition: null, dropParentId: null, dropIndex: null, previewPosition: { x: 0, y: 0 } });
      }}
      style={{ height: 4, background: dragState.isDragging && dragState.dropParentId === parentId && dragState.dropIndex === index ? '#21808d' : 'transparent', margin: '2px 0', borderRadius: 2 }}
    />
  );

  // Enhanced canvas element renderer with improved drag and drop
  const renderCanvasElement = (el, parentType = null, parent = null, index = 0) => {
    const isSelected = el.id === selectedElementId;
    const isDragging = el.id === draggedElementId;
    const isContainer = el.type === 'container';
    const isRow = el.type === 'row';
    const isColumn = el.type === 'column';

    // Layout styles
    let elementStyle = {
      position: 'relative',
      margin: isContainer ? '24px 0' : isRow ? '0' : '8px 0',
      background: isContainer ? '#f8f9fa' : isRow ? 'none' : 'none',
      borderRadius: isContainer ? '12px' : isRow ? '0' : '0',
      border: isSelected ? '2px solid #21808d' : 'none',
      outline: isSelected ? 'none' : '1px solid transparent',
      transition: 'all 0.2s',
      opacity: isDragging ? 0.5 : 1,
      cursor: 'move',
      boxShadow: isContainer ? '0 2px 12px rgba(33,128,141,0.06)' : 'none',
      padding: isContainer ? '32px 24px' : isRow ? '0' : '0',
      display: isRow ? 'flex' : isColumn ? 'flex' : 'block',
      flexDirection: isColumn ? 'column' : undefined,
      gap: isRow ? '32px' : undefined,
      minHeight: isContainer ? 120 : isRow ? 80 : undefined,
      minWidth: isColumn ? 120 : undefined,
      backgroundClip: 'padding-box',
    };
    if (isRow) {
      elementStyle.background = 'none';
      elementStyle.borderRadius = 0;
      elementStyle.padding = 0;
    }
    if (isColumn) {
      elementStyle.background = '#fff';
      elementStyle.borderRadius = '8px';
      elementStyle.boxShadow = '0 1px 4px rgba(33,128,141,0.04)';
      elementStyle.padding = '16px';
      elementStyle.margin = '0 8px';
      elementStyle.flex = 1;
      elementStyle.display = 'flex';
      elementStyle.flexDirection = 'column';
      elementStyle.justifyContent = 'center';
      elementStyle.alignItems = 'stretch';
    }

    // Children rendering met drop-zones
    let children = null;
    if (el.children && el.children.length > 0) {
      children = [];
      for (let idx = 0; idx < el.children.length; idx++) {
        children.push(renderCanvasElement(el.children[idx], el.type, el, idx));
      }
      // Add container drop zone if empty or for last position
      if (el.children.length === 0) {
        children.push(
          <div key="empty-drop-zone" className="container-empty-zone">
            <div className="container-empty-message">
              <span className="container-empty-icon">📦</span>
              <span>Drop elements here</span>
            </div>
          </div>
        );
      }
    } else {
      children = renderChildElement(el);
    }

    return (
      <>
        {/* Top insertion indicator */}
        <div 
          className={`insertion-indicator insertion-indicator--top ${insertionPoint?.targetId === el.id && insertionPoint?.position === 'before' ? 'insertion-indicator--active' : ''}`}
          onDragOver={e => handleInsertionDragOver(e, el.id, 'before', index)}
          onDrop={e => handleInsertionDrop(e, el.id, 'before', index)}
        />
        
        <div
          className={`canvas-element${isSelected ? ' canvas-element--selected' : ''}${isDragging ? ' canvas-element--dragging' : ''} ${isContainer ? 'container-element' : ''} ${isRow ? 'row-element' : ''} ${isColumn ? 'column-element' : ''}`}
          key={el.id}
          data-id={el.id}
          data-type={el.type}
          draggable
          onDragStart={e => handleCanvasElementDragStart(e, el)}
          onDragEnd={handleCanvasElementDragEnd}
          onDragOver={e => handleCanvasElementDragOver(e, el)}
          onDrop={e => handleCanvasElementDrop(e, el)}
          onClick={e => handleCanvasElementClick(el.id, e)}
          onContextMenu={e => handleContextMenu(e, el.id)}
          onMouseEnter={() => setCanvasHover(el.id)}
          onMouseLeave={() => setCanvasHover(null)}
          style={elementStyle}
        >
          {/* Element toolbar */}
          {(isSelected || canvasHover === el.id) && (
            <div className="element-toolbar">
              <div className="element-toolbar__handle">
                <span className="element-toolbar__icon">⋮⋮</span>
              </div>
              <div className="element-toolbar__info">
                <span className="element-toolbar__name">{el.name}</span>
              </div>
              <div className="element-toolbar__actions">
                <button className="element-toolbar__action" title="Duplicate">
                  <span>⧉</span>
                </button>
                <button className="element-toolbar__action" title="Delete" onClick={() => handleDeleteElement(el.id)}>
                  <span>🗑</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Container drop zone overlay */}
          {isContainer && isDragging && (
            <div className="container-drop-overlay">
              <div className="container-drop-message">
                <span className="container-drop-icon">📦</span>
                <span>Drop elements here</span>
              </div>
            </div>
          )}
          
          {children}
        </div>
        
        {/* Bottom insertion indicator */}
        <div 
          className={`insertion-indicator insertion-indicator--bottom ${insertionPoint?.targetId === el.id && insertionPoint?.position === 'after' ? 'insertion-indicator--active' : ''}`}
          onDragOver={e => handleInsertionDragOver(e, el.id, 'after', index + 1)}
          onDrop={e => handleInsertionDrop(e, el.id, 'after', index + 1)}
        />
      </>
    );
  };

  // 2. Drop-indicator alleen binnen canvas, duidelijke lijn/highlight
  const renderDropIndicator = () => {
    if (!isDragging || !dropTarget) return null;

    const { position, targetElement } = dropTarget;
    const indicatorStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      height: '4px',
      background: '#21808d',
      borderRadius: '2px',
      zIndex: 1000,
      pointerEvents: 'none',
      transition: 'all 0.2s ease'
    };

    if (!targetElement) {
      // Show at the end of the drop zone
      return (
        <div
          id="dropIndicator"
          style={{
            ...indicatorStyle,
            bottom: 0
          }}
        />
      );
    }

    const rect = targetElement.getBoundingClientRect();
    const dropZoneRect = dropTarget.zone.getBoundingClientRect();
    const top = position === 'before' 
      ? rect.top - dropZoneRect.top 
      : rect.bottom - dropZoneRect.top;

    return (
      <div
        id="dropIndicator"
        style={{
          ...indicatorStyle,
          top: `${top}px`
        }}
      />
    );
  };

  // 3. Layers drawer: uitklapbaar + drag & drop
  const renderLayersPanel = () => {
    const renderLayerItem = (el, depth = 0, parent = null) => {
      const isOpen = openLayers[el.id] || false;
      const hasChildren = el.children && el.children.length > 0;
      return (
        <div key={el.id}>
          <div
            className={`layer-item${el.id === selectedElementId ? ' layer-item--selected' : ''}`}
            style={{ paddingLeft: `${depth * 20}px`, cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
            draggable
            onDragStart={e => handleLayerDragStart(e, el)}
            onDragEnd={handleLayerDragEnd}
            onDragOver={e => handleLayerDragOver(e, el, parent, depth, 'before')}
            onDrop={e => handleLayerDrop(e, el, parent, depth, 'before')}
            onClick={() => setSelectedElementId(el.id)}
          >
            {hasChildren && (
              <span className="layer-toggle" onClick={e => { e.stopPropagation(); setOpenLayers(prev => ({ ...prev, [el.id]: !prev[el.id] })); }} style={{ marginRight: 4, cursor: 'pointer' }}>
                {isOpen ? '▼' : '▶'}
              </span>
            )}
            <span className="layer-icon">{getElementTypeById(el.type)?.icon || '📦'}</span>
            <span className="layer-name">{el.name}</span>
          </div>
          {hasChildren && isOpen && (
            <div>
              {el.children.map((child, idx) => (
                <div
                  key={child.id}
                  onDragOver={e => handleLayerDragOver(e, child, el, idx, 'before')}
                  onDrop={e => handleLayerDrop(e, child, el, idx, 'before')}
                >
                  {renderLayerItem(child, depth + 1, el)}
                  {idx === el.children.length - 1 && (
                    <div
                      onDragOver={e => handleLayerDragOver(e, child, el, idx + 1, 'after')}
                      onDrop={e => handleLayerDrop(e, child, el, idx + 1, 'after')}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };
    return <div className="layers-tree">{canvasElements.map(el => renderLayerItem(el))}</div>;
  };

  // Eigenschappen drawer: dynamisch per type
  const renderPropertiesPanel = () => {
    if (!selectedElement) {
      return (
        <div className="empty-state">
          <p>Selecteer een element om eigenschappen te bewerken</p>
        </div>
      );
    }

    return (
      <>
        <div className="prop-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`prop-tab${propTab === t.id ? ' active' : ''}`}
              onClick={() => setPropTab(t.id)}
            >
              {t.icon}
            </button>
          ))}
        </div>
        {/* Rest of the existing properties panel content */}
        {selectedElement.children ? (
            <>
              <div className="property-group">
                <h4 className="property-group__title">Blok</h4>
                <div className="property-item">
                  <label className="property-label">Naam</label>
                  <input
                    type="text"
                    className="form-control property-control"
                    value={selectedElement.name}
                    onChange={e => handlePropertyChange('name', e.target.value)}
                  />
                </div>
                <div className="property-item">
                  <label className="property-label">Omschrijving</label>
                  <textarea
                    className="form-control property-control"
                    value={selectedElement.content}
                    rows={2}
                    onChange={e => handlePropertyChange('content', e.target.value)}
                  />
                </div>
              </div>
              <div className="property-group">
                <div className="property-label" style={{ color: '#888', fontSize: 13 }}>
                  (Selecteer een child in het canvas om die te bewerken)
                </div>
              </div>
            </>
          ) : (
                    <>
                      <div className="property-group">
                        <h4 className="property-group__title">Tekst</h4>
                        <div className="property-item">
                          <label className="property-label">Naam</label>
                          <input
                            type="text"
                            className="form-control property-control"
                            value={selectedElement.name}
                            onChange={e => handlePropertyChange('name', e.target.value)}
                          />
                        </div>
                        <div className="property-item">
                          <label className="property-label">Tekst</label>
                          <textarea
                            className="form-control property-control"
                            value={selectedElement.content}
                            rows={3}
                            onChange={e => handlePropertyChange('content', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="property-group">
                        <h4 className="property-group__title">Stijl</h4>
                        <div className="property-item">
                          <label className="property-label">Tekstkleur</label>
                          <input
                            type="color"
                            className="property-control"
                            value={selectedElement.color || '#222222'}
                            onChange={e => handlePropertyChange('color', e.target.value)}
                          />
                        </div>
                        <div className="property-item">
                          <label className="property-label">Lettergrootte</label>
                          <input
                            type="number"
                            className="form-control property-control"
                            value={selectedElement.fontSize || (selectedElement.type === 'heading' ? 28 : 16)}
                            onChange={e => handlePropertyChange('fontSize', e.target.value)}
                            min={8}
                            max={80}
                          /> px
                        </div>
                        <div className="property-item">
                          <label className="property-label">Uitlijning</label>
                          <select
                            className="form-control property-control"
                            value={selectedElement.textAlign || 'left'}
                            onChange={e => handlePropertyChange('textAlign', e.target.value)}
                          >
                            <option value="left">Links</option>
                            <option value="center">Midden</option>
                            <option value="right">Rechts</option>
                          </select>
                        </div>
                      </div>
          </>
        )}
                    </>
                  );
  };

  // Pas styles van canvas-elementen aan op basis van properties
  const getElementStyle = (el) => {
    let style = {};
    if (el.type === 'text' || el.type === 'paragraph' || el.type === 'heading') {
      style.color = el.color || (el.type === 'heading' ? '#222' : '#333');
      style.fontSize = (el.fontSize ? el.fontSize + 'px' : (el.type === 'heading' ? '28px' : '16px'));
      style.textAlign = el.textAlign || 'left';
    }
    if (el.type === 'button') {
      style.background = el.bgColor || '#21808d';
      style.color = el.color || '#fff';
    }
    if (el.type === 'image') {
      style.width = (el.width || 320) + 'px';
      style.height = (el.height || 180) + 'px';
      style.borderRadius = (el.radius || 8) + 'px';
      style.objectFit = 'cover';
      style.display = 'block';
      style.margin = '0 auto';
    }
    return style;
  };

  // Sluit contextmenu bij klik buiten menu
  React.useEffect(() => {
    if (!contextMenu.visible) return;
    const close = (e) => {
      if (!e.target.closest('.context-menu')) handleContextMenuClose();
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [contextMenu.visible]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      // Delete/backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        handleDeleteElement(selectedElementId);
      }
      // Copy
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && selectedElementId) {
        const el = canvasElements.find(el => el.id === selectedElementId);
        if (el) setClipboard(JSON.parse(JSON.stringify(el)));
      }
      // Paste
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v' && clipboard) {
        const newId = `el_${nextId}`;
        const copy = { ...clipboard, id: newId };
        setCanvasElements(els => [...els, copy]);
        setNextId(id => id + 1);
        setSelectedElementId(newId);
      }
      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && selectedElementId) {
        const el = canvasElements.find(el => el.id === selectedElementId);
        if (el) {
          const newId = `el_${nextId}`;
          const copy = { ...el, id: newId, name: el.name + ' (kopie)' };
          setCanvasElements(els => [...els, copy]);
          setNextId(id => id + 1);
          setSelectedElementId(newId);
        }
      }
      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      // Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, clipboard, canvasElements, nextId, handleUndo, handleRedo]);

  // Panel toggle handler
  const handlePanelToggle = (panel) => {
    if (activePanel === panel && isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setActivePanel(panel);
      setIsPanelOpen(true);
    }
  };

  // Panel close handler (kruisje)
  const handlePanelClose = () => setIsPanelOpen(false);

  // Eigenschappen drawer close handler
  const handlePropertiesClose = () => setSelectedElementId(null);

  // Sluit eigenschappen drawer bij klik buiten canvas
  React.useEffect(() => {
    if (!selectedElementId) return;
    const close = (e) => {
      if (!e.target.closest('.canvas') && !e.target.closest('.properties-panel')) {
        setSelectedElementId(null);
      }
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [selectedElementId]);

  // Helper: insert element at index in tree (parentId, index)
  const insertElementAtIndex = (elements, parentId, index, newElement) => {
    if (!parentId) {
      return insertAt(elements, index, newElement);
    }
    return elements.map(el => {
      if (el.id === parentId) {
        const children = el.children || [];
        return { ...el, children: insertAt(children, index, newElement) };
      }
      if (el.children) {
        return { ...el, children: insertElementAtIndex(el.children, parentId, index, newElement) };
      }
      return el;
    });
  };

  // 1. Drag & drop in layers drawer: index-based
  const handleLayerDragStart = (e, el) => {
    const layerItem = e.currentTarget;
    const elementId = el.id;
    
    // Find the corresponding canvas element
    const canvasElement = document.querySelector(`[data-element-id="${elementId}"]`);
    if (!canvasElement) return;
    
    // Create element data for drag operation
    const elementData = {
      id: elementId,
      type: el.type,
      isFromLayers: true,
      sourceElement: canvasElement,
      layerItem: layerItem
    };
    
    setDraggedElement(elementData);
    setIsDragging(true);
    
    // Visual feedback for layers drag
    layerItem.classList.add('layer-item--dragging');
    canvasElement.classList.add('canvas-element--dragging-from-layers');
    
    // Set drag data
    e.dataTransfer.setData('text/plain', JSON.stringify(elementData));
    e.dataTransfer.effectAllowed = 'move';
    
    // Create custom drag image
    const dragImage = canvasElement.cloneNode(true);
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, dragOffset.x, dragOffset.y);
    
    // Clean up drag image
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleLayerDragEnd = () => {
    setDraggedLayerId(null);
    setDragType(null);
  };

  const handleLayerDragOver = (e, overEl, parent, idx, pos) => {
    e.preventDefault();
    setDragState(prev => ({
      ...prev,
      dropTarget: overEl.id,
      dropPosition: pos,
      dropParentId: parent?.id || null,
      dropIndex: idx,
      isDragging: true
    }));
  };

  const handleLayerDrop = (e, overEl, parent, idx, pos) => {
    e.preventDefault();
    if (!draggedLayerId || draggedLayerId === overEl.id) return;
    setCanvasElements(prev => {
      let [withoutDragged, dragged] = removeElementAndReturn(prev, draggedLayerId);
      if (!dragged) return prev;
      return insertElementAtIndex(withoutDragged, parent?.id || null, idx, dragged);
    });
    setDraggedLayerId(null);
    setDragType(null);
    setDragState({ isDragging: false, draggedElement: null, dropTarget: null, dropPosition: null, dropParentId: null, dropIndex: null, previewPosition: { x: 0, y: 0 } });
  };

  // Add new drag and drop handlers
  const handleDragStart = (e, elementData) => {
    // Zet de drag data
    const dragData = {
      type: elementData.type || elementData.id,
      name: elementData.name || elementData.type || elementData.id,
      content: elementData.content || '',
      children: elementData.children || [],
      id: elementData.id || null
    };
    
    // Sla de data op in de drag event
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // Update state
    setDraggedElement(dragData);
    setIsDragging(true);
    
    // Store initial position for calculations
    const rect = e.target.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Create custom drag image
    const dragImage = e.target.cloneNode(true);
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, dragOffset.x, dragOffset.y);
    
    // Clean up drag image
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!isDragging) return;
    
    const dropZone = e.currentTarget;
    const { insertPosition, targetElement, insertIndex } = calculateDropPosition(e, dropZone);
    
    // Update visual indicator
    updateDropIndicator(insertPosition, targetElement, dropZone);
    
    // Update drop state
    setDropTarget({
      zone: dropZone,
      position: insertPosition,
      targetElement: targetElement,
      insertIndex: insertIndex
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    hideDropIndicator();
    
    if (!dropTarget) return;
    
    const { zone, position, targetElement, insertIndex } = dropTarget;
    
    // Haal de data op uit de drag event
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    
    const draggedData = JSON.parse(data);
    
    // Als het element al bestaat (verplaatsing), verwijder het eerst
    if (draggedData.id) {
      setCanvasElements(prev => {
        const [withoutDragged, dragged] = removeElementAndReturn(prev, draggedData.id);
        if (!dragged) return prev;

        // Bepaal de juiste parentId en index
        let parentId = null;
        let index = 0;

        if (zone && zone.dataset && zone.dataset.id) {
          parentId = zone.dataset.id;
        }
        if (typeof insertIndex === 'number') {
          index = insertIndex;
        }

        // Voeg het element toe op de nieuwe locatie
        return insertElementAtIndex(withoutDragged, parentId, index, dragged);
      });
    } else {
      // Nieuwe element toevoegen
      insertElementAtDropZone(draggedData, zone, position, targetElement, insertIndex);
    }
    
    // Clean up
    setDraggedElement(null);
    setIsDragging(false);
    setDropTarget(null);
  };

  // Helper functions for drag and drop
  const calculateDropPosition = (e, dropZone) => {
    const rect = dropZone.getBoundingClientRect();
    const mouseY = e.clientY;
    const dropZoneY = rect.top;
    const relativeY = mouseY - dropZoneY;
    
    // Get all droppable elements in the zone
    const elements = Array.from(dropZone.querySelectorAll('.canvas-element:not(.canvas-element--dragging)'));
    
    // If no elements, drop at beginning
    if (elements.length === 0) {
      return {
        insertPosition: 'first',
        targetElement: null,
        insertIndex: 0
      };
    }
    
    // Find the closest element and determine position
    let closestElement = null;
    let insertPosition = 'after';
    let insertIndex = elements.length;
    let minDistance = Infinity;
    
    elements.forEach((element, index) => {
      const elementRect = element.getBoundingClientRect();
      const elementMiddle = elementRect.top + elementRect.height / 2;
      const distance = Math.abs(mouseY - elementMiddle);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestElement = element;
        
        // Determine if we should insert before or after
        if (mouseY < elementMiddle) {
          insertPosition = 'before';
          insertIndex = index;
        } else {
          insertPosition = 'after';
          insertIndex = index + 1;
        }
      }
    });
    
    return {
      insertPosition,
      targetElement: closestElement,
      insertIndex
    };
  };

  const updateDropIndicator = (insertPosition, targetElement, dropZone) => {
    const indicator = createDropIndicator();
    const rect = dropZone.getBoundingClientRect();
    let top;
    let left;
    let width;

    if (dropZone.classList.contains('container-element')) {
      // Container indicator
      if (insertPosition === 'before') {
        top = rect.top + 8;
      } else if (insertPosition === 'after') {
        top = rect.bottom - 8;
      } else {
        top = rect.top + rect.height / 2;
      }
      left = rect.left + 16;
      width = rect.width - 32;
    } else {
      // Canvas element indicator
      if (targetElement) {
        const targetRect = targetElement.getBoundingClientRect();
        if (insertPosition === 'before') {
          top = targetRect.top;
        } else if (insertPosition === 'after') {
          top = targetRect.bottom;
        } else {
          top = targetRect.top + targetRect.height / 2;
        }
        left = targetRect.left;
        width = targetRect.width;
      } else {
        // Als er geen target element is, toon de indicator in het midden van de drop zone
        top = rect.top + rect.height / 2;
        left = rect.left;
        width = rect.width;
      }
    }

    indicator.style.top = `${top}px`;
    indicator.style.left = `${left}px`;
    indicator.style.width = `${width}px`;
    indicator.style.display = 'block';
  };

  const showDropIndicatorForEmptyZone = (dropZone) => {
    const indicator = createDropIndicator();
    const rect = dropZone.getBoundingClientRect();
    
    indicator.style.position = 'fixed';
    indicator.style.top = `${rect.top + 16}px`;
    indicator.style.left = `${rect.left + 16}px`;
    indicator.style.width = `${rect.width - 32}px`;
    indicator.style.display = 'block';
    indicator.style.zIndex = '1000';
    
    indicator.classList.add('drop-indicator--active');
  };

  // Container element support
  const makeElementContainer = (element, containerType = 'container') => {
    element.classList.add('container-element');
    element.dataset.containerType = containerType;
    
    // Add drop zone properties
    element.addEventListener('dragover', handleContainerDragOver);
    element.addEventListener('drop', handleContainerDrop);
    element.addEventListener('dragleave', handleContainerDragLeave);
    
    // Ensure container can accept children
    if (!element.querySelector('.container-content')) {
      const content = document.createElement('div');
      content.className = 'container-content';
      content.innerHTML = element.innerHTML;
      element.innerHTML = '';
      element.appendChild(content);
    }
  };

  const handleContainerDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = e.currentTarget;
    const content = container.querySelector('.container-content');
    
    if (!content) return;
    
    // Calculate position within container
    const { insertPosition, targetElement, insertIndex } = calculateDropPosition(e, content);
    
    // Show container-specific indicator using the combined updateDropIndicator function
    updateDropIndicator(insertPosition, targetElement, container);
    
    // Highlight container
    container.classList.add('container--drag-over');
    setContainerDragOver(container);
    
    setDropTarget({
      zone: content,
      container: container,
      position: insertPosition,
      targetElement: targetElement,
      insertIndex: insertIndex
    });
  };

  const handleContainerDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = e.currentTarget;
    container.classList.remove('container--drag-over');
    setContainerDragOver(null);
    
    if (!dropTarget) return;
    
    const { zone, position, targetElement, insertIndex } = dropTarget;
    insertElementAtDropZone(draggedElement, zone, position, targetElement, insertIndex);
    
    // Clean up
    setDraggedElement(null);
    setIsDragging(false);
    setDropTarget(null);
    hideDropIndicator();
  };

  const handleContainerDragLeave = (e) => {
    const container = e.currentTarget;
    container.classList.remove('container--drag-over');
    setContainerDragOver(null);
  };

  // Insert element at correct position in state (not DOM)
  const insertElementAtDropZone = (elementData, dropZone, position, targetElement, insertIndex) => {
    // Only for new elements, not for moving existing ones
    let newElement = createElement(elementData);
    let parentId = null;
    let index = 0;

    if (dropZone && dropZone.dataset && dropZone.dataset.id) {
      parentId = dropZone.dataset.id;
    }
    if (typeof insertIndex === 'number') {
      index = insertIndex;
    }

    setCanvasElements(prev => insertElementAtIndex(prev, parentId, index, newElement));
    setNextId(id => id + 1);
  };

  // Animation helpers
  const animateElementInsertion = (element) => {
    element.style.animation = 'elementInsert 0.3s ease-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 300);
  };

  const animateElementMove = (element) => {
    element.style.animation = 'elementMove 0.3s ease-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 300);
  };

  // Add CSS for animations
  const styles = `
    @keyframes elementInsert {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes elementMove {
      from {
        opacity: 0.5;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes dropIndicatorPulse {
      from {
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      }
      to {
        box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
      }
    }

    .drop-indicator-line {
      position: fixed;
      height: 3px;
      background: linear-gradient(90deg, #3B82F6, #10B981);
      border-radius: 2px;
      display: none;
      z-index: 1000;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      transition: all 0.2s ease;
    }

    .drop-indicator-line.drop-indicator--active {
      animation: dropIndicatorPulse 1s ease-in-out infinite alternate;
    }

    .container-element {
      min-height: 80px;
      border: 2px dashed transparent;
      border-radius: var(--radius-base);
      transition: all var(--duration-fast) ease;
      position: relative;
    }

    .container-element.container--drag-over {
      border-color: #3B82F6;
      background-color: rgba(59, 130, 246, 0.05);
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
    }

    .container-content {
      min-height: 60px;
      padding: var(--space-12);
      position: relative;
    }

    .container-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      color: var(--color-text-secondary);
      font-style: italic;
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-sm);
      background: rgba(0, 0, 0, 0.02);
    }
  `;

  // Add styles to document
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // --- Enhanced Drag-and-drop functions ---
  
  // Enhanced insertion point handlers
  const handleInsertionDragOver = (e, targetId, position, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    setInsertionPoint({
      targetId,
      position,
      index
    });
  };
  
  const handleInsertionDrop = (e, targetId, position, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragData = e.dataTransfer.getData('application/json');
    if (!dragData) return;
    
    const droppedData = JSON.parse(dragData);
    
    if (droppedData.isExisting) {
      // Moving existing element
      moveElement(droppedData.id, targetId, position, index);
    } else {
      // Adding new element
      addNewElement(droppedData, targetId, position, index);
    }
    
    setInsertionPoint(null);
    setDraggedElement(null);
    setIsDragging(false);
  };
  
  // Enhanced canvas element drag over
  const handleCanvasElementDragOver = (e, element) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDragging) return;
    
    // Show container drop zone for containers
    if (element.type === 'container' || element.type === 'row' || element.type === 'column') {
      setContainerDragOver(element.id);
    }
    
    // Calculate mouse position for insertion indicator
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    if (y < height * 0.3) {
      setInsertionPoint({ targetId: element.id, position: 'before' });
    } else if (y > height * 0.7) {
      setInsertionPoint({ targetId: element.id, position: 'after' });
    } else if (element.type === 'container' || element.type === 'row' || element.type === 'column') {
      setInsertionPoint({ targetId: element.id, position: 'inside' });
    } else {
      setInsertionPoint({ targetId: element.id, position: 'after' });
    }
  };
  
  // Enhanced canvas element drop
  const handleCanvasElementDrop = (e, element) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContainerDragOver(null);
    setInsertionPoint(null);
    
    const dragData = e.dataTransfer.getData('application/json');
    if (!dragData) return;
    
    const droppedData = JSON.parse(dragData);
    
    if (droppedData.isExisting) {
      // Moving existing element
      if (insertionPoint) {
        moveElement(droppedData.id, insertionPoint.targetId, insertionPoint.position);
      }
    } else {
      // Adding new element
      if (insertionPoint) {
        addNewElement(droppedData, insertionPoint.targetId, insertionPoint.position);
      }
    }
    
    setDraggedElement(null);
    setIsDragging(false);
  };
  
  // Move existing element
  const moveElement = (elementId, targetId, position, index = null) => {
    setCanvasElements(prev => {
      // Remove element from its current position
      const [elementsWithoutDragged, draggedElement] = removeElementAndReturn(prev, elementId);
      if (!draggedElement) return prev;
      
      // Insert at new position
      if (position === 'inside') {
        return insertElementIntoContainer(elementsWithoutDragged, targetId, draggedElement);
      } else if (position === 'end' || targetId === null) {
        return [...elementsWithoutDragged, draggedElement];
      } else {
        return insertElementAtPosition(elementsWithoutDragged, targetId, position, draggedElement, index);
      }
    });
  };
  
  // Add new element
  const addNewElement = (elementData, targetId, position, index = null) => {
    let newElement;
    
    if (elementData.type === 'element') {
      newElement = {
        id: `el_${nextId}`,
        type: elementData.id,
        name: elementData.name,
        content: elementData.defaultContent || '',
      };
    } else if (elementData.type === 'block') {
      const children = createBlockChildren(elementData, nextId);
      newElement = {
        id: `block_${nextId}`,
        type: elementData.id,
        name: elementData.name,
        content: elementData.preview || '',
        children,
      };
    }
    
    setCanvasElements(prev => {
      if (position === 'inside') {
        return insertElementIntoContainer(prev, targetId, newElement);
      } else if (position === 'end' || targetId === null) {
        return [...prev, newElement];
      } else {
        return insertElementAtPosition(prev, targetId, position, newElement, index);
      }
    });
    
    setNextId(id => id + (elementData.type === 'block' ? 9 : 1));
  };
  
  // Insert element into container
  const insertElementIntoContainer = (elements, containerId, newElement) => {
    return elements.map(el => {
      if (el.id === containerId) {
        const children = el.children || [];
        return { ...el, children: [...children, newElement] };
      }
      if (el.children) {
        return { ...el, children: insertElementIntoContainer(el.children, containerId, newElement) };
      }
      return el;
    });
  };
  
  // Insert element at specific position
  const insertElementAtPosition = (elements, targetId, position, newElement, index = null) => {
    const result = [];
    
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      
      if (el.id === targetId) {
        if (position === 'before') {
          result.push(newElement);
          result.push(el);
        } else if (position === 'after') {
          result.push(el);
          result.push(newElement);
        }
      } else {
        if (el.children) {
          el.children = insertElementAtPosition(el.children, targetId, position, newElement, index);
        }
        result.push(el);
      }
    }
    
    // If no target found and position is at end
    if (!result.find(el => el.id === targetId) && position === 'after') {
      result.push(newElement);
    }
    
    return result;
  };
  
  // --- Original drag-and-drop helper functions (fixes for ESLint errors) ---

  // Hide the drop indicator
  const hideDropIndicator = () => {
    const indicators = document.querySelectorAll('.drop-indicator-line');
    indicators.forEach(indicator => {
      indicator.style.display = 'none';
      indicator.classList.remove('drop-indicator--active');
    });
  };

  // Create or get the drop indicator element
  const createDropIndicator = () => {
    // Verwijder eerst bestaande indicators
    const existingIndicators = document.querySelectorAll('.drop-indicator-line');
    existingIndicators.forEach(indicator => indicator.remove());

    // Maak nieuwe indicator
    const indicator = document.createElement('div');
    indicator.id = 'dropIndicator';
    indicator.className = 'drop-indicator-line drop-indicator--active';
    indicator.style.position = 'fixed';
    indicator.style.height = '3px';
    indicator.style.background = 'linear-gradient(90deg, #3B82F6, #10B981)';
    indicator.style.borderRadius = '2px';
    indicator.style.pointerEvents = 'none';
    indicator.style.zIndex = '1000';
    indicator.style.display = 'none';
    indicator.style.boxShadow = '0 0 8px rgba(59, 130, 246, 0.4)';
    indicator.style.transition = 'all 0.2s ease';
    document.body.appendChild(indicator);
    return indicator;
  };

  // Create drag preview
  const createDragPreview = (e, name, icon) => {
    const preview = document.createElement('div');
    preview.className = 'drag-preview';
    preview.innerHTML = `
      <div class="drag-preview__content">
        <div class="drag-preview__icon">${icon}</div>
        <div class="drag-preview__name">${name}</div>
      </div>
    `;
    
    document.body.appendChild(preview);
    e.dataTransfer.setDragImage(preview, 20, 20);
    
    // Clean up after drag
    setTimeout(() => {
      if (document.body.contains(preview)) {
        document.body.removeChild(preview);
      }
    }, 0);
  };
  
  // Create a new element from drag data (for state, not DOM)
  const createElement = (elementData) => {
    return {
      id: `el_${nextId}`,
      type: elementData.type || elementData.id,
      name: elementData.name || elementData.type || elementData.id,
      content: elementData.content || '',
      children: elementData.children || [],
    };
  };

  // Update React state after DOM changes (stub for now)
  const updateElementsState = () => {
    // No-op, state is updated directly
  };

  // ... rest of the existing code ...

  return (
    <div className="page-builder">
      <header className="topbar">
  <div className="topbar__left">
  <div className="topbar__logo">
    <img src="/plug&pay icon color.png" alt="Plug & Pay Logo" />
    </div>
    <div>
    <h1 className="topbar__title">Page Builder</h1>
    <span className="topbar__title-sub">Laatste bewerking 21-04-2023 om 15:14</span>
    </div>
  </div>
  <div className="topbar__center">
    <div className="device-selector">
      <button
        className={`device-btn${device === 'desktop' ? ' device-btn--active' : ''}`}
        data-device="desktop"
        onClick={() => setDevice('desktop')}
        aria-label="Desktop"
        type="button"
      >
        <FaDesktop className="device-icon" />
        <span className="device-label">Desktop</span>
      </button>
      <button
        className={`device-btn${device === 'tablet' ? ' device-btn--active' : ''}`}
        data-device="tablet"
        onClick={() => setDevice('tablet')}
        aria-label="Tablet"
        type="button"
      >
        <FaTabletScreenButton className="device-icon" />
        <span className="device-label">Tablet</span>
      </button>
      <button
        className={`device-btn${device === 'mobile' ? ' device-btn--active' : ''}`}
        data-device="mobile"
        onClick={() => setDevice('mobile')}
        aria-label="Mobile"
        type="button"
      >
        <FaMobileScreen className="device-icon" />
        <span className="device-label">Mobile</span>
      </button>
    </div>
  </div>
  <div className="topbar__right">
    <button
      className="btn btn--secondary"
      id="undoBtn"
      onClick={handleUndo}
      disabled={historyIndex <= 0}
      style={{ opacity: historyIndex <= 0 ? 0.5 : 1 }}
      aria-label="Ongedaan maken"
      type="button"
    >
      <FaArrowRotateLeft className="btn-icon" />
      <span className="btn-label"></span>
    </button>
    <button
      className="btn btn--secondary"
      id="redoBtn"
      onClick={handleRedo}
      disabled={historyIndex >= history.length - 1}
      style={{ opacity: historyIndex >= history.length - 1 ? 0.5 : 1 }}
      aria-label="Opnieuw"
      type="button"
    >
      <FaArrowRotateRight className="btn-icon" />
      <span className="btn-label"></span>
    </button>
    <button
      className="btn btn--sm btn--outline"
      id="previewBtn"
      onClick={FaRegEye}
      type="button"
    >
      <FaRegEye className="btn-icon" />
      <span className="btn-label">Voorbeeld</span>
    </button>
    <button
      className="btn btn--sm"
      id="saveBtn"
      onClick={FaFloppyDisk}
      type="button"
    >
      <FaFloppyDisk className="btn-icon" />
      <span className="btn-label">Opslaan</span>
    </button>
  </div>
</header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__main">
            <button
              className={`sidebar-btn${activePanel === 'elements' && isPanelOpen ? ' sidebar-btn--active' : ''}`}
              data-panel="elements"
              onClick={() => handlePanelToggle('elements')}
            >
              <span className="sidebar-icon"><FaPlus /></span>
              <span className="sidebar-label">Elementen</span>
            </button>
            <button
              className={`sidebar-btn${activePanel === 'blocks' && isPanelOpen ? ' sidebar-btn--active' : ''}`}
              data-panel="blocks"
              onClick={() => handlePanelToggle('blocks')}
            >
              <span className="sidebar-icon"><FaTableColumns /></span>
              <span className="sidebar-label">Blokken</span>
            </button>
            <button
              className={`sidebar-btn${activePanel === 'layers' && isPanelOpen ? ' sidebar-btn--active' : ''}`}
              data-panel="layers"
              onClick={() => handlePanelToggle('layers')}
            >
              <span className="sidebar-icon"><FaLayerGroup /></span>
              <span className="sidebar-label">Lagen</span>
            </button>
          </div>
          <div className="sidebar__footer">
            <button className="sidebar-btn" id="helpBtn">
              <span className="sidebar-icon"><FaQuestion /></span>
              <span className="sidebar-label">Help</span>
            </button>
            <button className="sidebar-btn" id="settingBtn">
              <span className="sidebar-icon"><FaGear /></span>
              <span className="sidebar-label">Instellingen</span>
            </button>
            <button className="sidebar-btn" id="exitBtn">
              <span className="sidebar-icon"><FaDoorOpen /></span>
              <span className="sidebar-label">Afsluiten</span>
            </button>
          </div>
        </aside>
        {/* Panels */}
        <div className={`panels${isPanelOpen ? ' panels--open' : ''}`}>
          {/* Elements Panel */}
          <div
            className={`panel panel--elements${activePanel === 'elements' && isPanelOpen ? ' panel--active' : ''}`}
            data-panel="elements"
          >
            <div className="panel__header">
              <div className="panel__header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 40 }}>
                <h3 className="panel__title" style={{ margin: 0 }}>Elementen toevoegen</h3>
                <button className="panel-close" onClick={handlePanelClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', padding: 0, height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              <div className="search-box" style={{ width: '100%', padding: '16px 16px 0 16px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input type="text" className="search-input" placeholder="Zoek elementen..." id="elementsSearch" style={{ width: '100%' }} />
                {/* <button className="search-clear" id="elementsClear"><span /></button> */}
              </div>
            </div>
            <div className="panel__content">
              <div className="element-categories">
                {Object.keys(elementTypes).map(category => (
                  <div
                    className={`category${openElementCategories[category] ? ' category--active' : ''}`}
                    data-category={category}
                    key={category}
                  >
                    <div className="category__header" onClick={() => toggleElementCategory(category)} style={{ cursor: 'pointer' }}>
                      <span className="category__icon">
                        {category === 'basic' && <FaRegFontAwesome />}
                        {category === 'layout' && <FaTableColumns />}
                        {category === 'typography' && <FaParagraph />}
                        {category === 'media' && <FaRegImages />}
                      </span>
                      <span className="category__title">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="category__toggle">{openElementCategories[category] ? <FaChevronDown /> : <FaChevronRight />}</span>
                    </div>
                    {openElementCategories[category] && (
                      <div className="category__content" id={`${category}Elements`}>
                        {elementTypes[category].map(element => (
                          <div
                            className="element-item"
                            draggable
                            key={element.id}
                            onDragStart={e => handleSidebarElementDragStart(e, element)}
                            onClick={() => handleElementClick(element)}
                          >
                            <div className="element-icon">{element.icon}</div>
                            <div className="element-info">
                              <div className="element-name">{element.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Blocks Panel */}
          <div
            className={`panel panel--blocks${activePanel === 'blocks' && isPanelOpen ? ' panel--active' : ''}`}
            data-panel="blocks"
          >
            <div className="panel__header">
              <div className="panel__header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 40 }}>
                <h3 className="panel__title" style={{ margin: 0 }}>Blokken toevoegen</h3>
                <button className="panel-close" onClick={handlePanelClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', padding: 0, height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              <div className="search-box" style={{ width: '100%', padding: '16px 16px 0 16px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input type="text" className="search-input" placeholder="Zoek blokken..." id="blocksSearch" style={{ width: '100%' }} />
                <button className="search-clear" id="blocksClear"><span /></button>
              </div>
            </div>
            <div className="panel__content">
              <div className="block-categories">
                {Object.keys(blockTypes).map(category => (
                  <div
                    className={`category${openBlockCategories[category] ? ' category--active' : ''}`}
                    data-category={category}
                    key={category}
                  >
                    <div className="category__header" onClick={() => toggleBlockCategory(category)} style={{ cursor: 'pointer' }}>
                      <span className="category__icon">
                        {category === 'hero' && <FaShieldHalved />}
                        {category === 'content' && <FaRegFileLines />}
                        {category === 'testimonials' && <FaRegStarHalfStroke />}
                      </span>
                      <span className="category__title">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="category__toggle">{openBlockCategories[category] ? '▼' : '▶'}</span>
                    </div>
                    {openBlockCategories[category] && (
                      <div className="category__content" id={`${category}Blocks`}>
                        {blockTypes[category].map(block => (
                          <div
                            className="block-item"
                            draggable
                            key={block.id}
                            onDragStart={e => handleSidebarBlockDragStart(e, block)}
                            onClick={() => handleBlockClick(block)}
                          >
                            <div className="block-icon">📦</div>
                            <div className="block-info">
                              <div className="block-name">{block.name}</div>
                              <div className="block-preview">{block.preview}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Layers Panel */}
          <div
            className={`panel panel--layers${activePanel === 'layers' && isPanelOpen ? ' panel--active' : ''}`}
            data-panel="layers"
          >
            <div className="panel__header">
              <div className="panel__header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 40 }}>
                <h3 className="panel__title" style={{ margin: 0 }}>Lagen</h3>
                <button className="panel-close" onClick={handlePanelClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', padding: 0, height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              <div className="search-box" style={{ width: '100%', padding: '16px 16px 0 16px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input type="text" className="search-input" placeholder="Zoek lagen..." id="layersSearch" style={{ width: '100%' }} />
                <button className="search-clear" id="layersClear"><span /></button>
              </div>
            </div>
            <div className="panel__content">
              <div className="layers-tree" id="layersTree">
                {renderLayersPanel()}
              </div>
            </div>
          </div>
        </div>
        <main className="canvas-container">
          <div className="canvas-wrapper">
            <div
              className="canvas"
              id="canvas"
              data-device={device}
              onDrop={handleCanvasEmptyDrop}
              onDragOver={handleCanvasEmptyDragOver}
            >
              <div
                className="canvas-content"
                id="canvasContent"
                onClick={handleCanvasClick}
                onDragOver={handleCanvasEmptyDragOver}
                onDrop={handleCanvasEmptyDrop}
                data-drag-active={isDragging}
                style={{ minHeight: 400, position: 'relative' }}
              >
                {/* Canvas empty state */}
                {canvasElements.length === 0 && (
                  <div className={`canvas-empty-state ${isDragging ? 'canvas-empty-state--drag-active' : ''}`}>
                    <div className="canvas-empty-content">
                      <div className="canvas-empty-icon">🎨</div>
                      <h3 className="canvas-empty-title">
                        {isDragging ? 'Drop your element here' : 'Begin met bouwen'}
                      </h3>
                      <p className="canvas-empty-description">
                        {isDragging 
                          ? 'Release to add this element to your page' 
                          : 'Sleep elementen vanaf de zijbalk of klik erop om ze toe te voegen'
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Canvas elements */}
                {canvasElements.map((el, index) => renderCanvasElement(el, null, null, index))}
                
                {/* Final drop zone for adding elements at the end */}
                {canvasElements.length > 0 && (
                  <div 
                    className={`canvas-final-drop-zone ${insertionPoint?.position === 'end' ? 'canvas-final-drop-zone--active' : ''}`}
                    onDragOver={e => {
                      e.preventDefault();
                      setInsertionPoint({ targetId: null, position: 'end' });
                    }}
                    onDrop={handleCanvasEmptyDrop}
                  >
                    <div className="canvas-final-drop-content">
                      <span className="canvas-final-drop-icon">+</span>
                      <span className="canvas-final-drop-text">Add element here</span>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
        </main>
        <aside className={`properties-panel${selectedElementId ? ' properties-panel--open' : ''}`} id="propertiesPanel">
          <div className="properties-header">
            <h3 className="properties-title">Eigenschappen</h3>
            <button className="properties-close" id="propertiesClose" onClick={handlePropertiesClose}>×</button>
          </div>
          <div className="properties-content" id="propertiesContent">
            {selectedElementId ? renderPropertiesPanel() : <div className="empty-state"><p>Selecteer een element om eigenschappen te bewerken</p></div>}
          </div>
        </aside>
      {contextMenu.visible && (
        <div
          className="context-menu context-menu--show"
          style={{ left: contextMenu.x, top: contextMenu.y, position: 'fixed', zIndex: 1000 }}
        >
          <div className="context-menu__item" onClick={() => handleContextMenuClose()}>
            <span className="context-menu__icon">📋</span>
            <span className="context-menu__label">Kopiëren</span>
            <span className="context-menu__shortcut">Ctrl+C</span>
          </div>
          <div className="context-menu__item" onClick={() => handleContextMenuClose()}>
            <span className="context-menu__icon">📄</span>
            <span className="context-menu__label">Plakken</span>
            <span className="context-menu__shortcut">Ctrl+V</span>
          </div>
          <div className="context-menu__item" onClick={() => handleContextMenuClose()}>
            <span className="context-menu__icon">📑</span>
            <span className="context-menu__label">Dupliceren</span>
            <span className="context-menu__shortcut">Ctrl+D</span>
          </div>
          <div className="context-menu__divider"></div>
          <div className="context-menu__item" onClick={() => handleDeleteElement(contextMenu.elementId)}>
            <span className="context-menu__icon">🗑</span>
            <span className="context-menu__label">Verwijderen</span>
            <span className="context-menu__shortcut">Del</span>
          </div>
        </div>
      )}
      {/* Drag Overlay */}
      <div className="drag-overlay" id="dragOverlay"></div>
      {/* Drop Indicators */}
      <div className="drop-indicator" id="dropIndicator"></div>
      {renderDropPreview()}
      {renderDropIndicator()}
    </div>
  </div>
);
};

export default PageBuilder; 