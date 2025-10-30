export function setupImageViewer(viewerContainer, totalImages, stateRef) {
    const slider = viewerContainer.querySelector('.image-slider');
    const prevBtn = viewerContainer.querySelector('.prev');
    const nextBtn = viewerContainer.querySelector('.next');
    const indicators = viewerContainer.querySelectorAll('.indicator');
    let imageViewerCurrentIndex = stateRef.currentImageIndex || 0;
    let startX = 0;
    let currentTranslate = 0;
    let isDragging = false;

    function updateSliderVisuals(index) {
        currentTranslate = -index * 100;
        slider.style.transform = `translateX(${currentTranslate}%)`;
        indicators.forEach((ind, i) => { ind.classList.toggle('active', i === index); });
    }
    function showSlideVisuals(index) {
        if (index < 0) index = totalImages - 1;
        if (index >= totalImages) index = 0;
        imageViewerCurrentIndex = index;
        stateRef.currentImageIndex = index;
        updateSliderVisuals(index);
    }

    prevBtn?.addEventListener('click', () => showSlideVisuals(imageViewerCurrentIndex - 1));
    nextBtn?.addEventListener('click', () => showSlideVisuals(imageViewerCurrentIndex + 1));
    indicators.forEach((ind) => { ind.addEventListener('click', () => showSlideVisuals(parseInt(ind.dataset.index, 10))); });

    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; slider.style.transition = 'none'; }, { passive: true });
    slider.addEventListener('touchmove', (e) => { if (!isDragging) return; const currentX = e.touches[0].clientX; const diffX = currentX - startX; slider.style.transform = `translateX(${currentTranslate + (diffX / slider.offsetWidth) * 100}%)`; }, { passive: true });
    slider.addEventListener('touchend', (e) => { if (!isDragging) return; isDragging = false; slider.style.transition = 'transform 0.3s ease-in-out'; const endX = e.changedTouches[0].clientX; const diffX = endX - startX; const threshold = slider.offsetWidth / 4; if (diffX > threshold) showSlideVisuals(imageViewerCurrentIndex - 1); else if (diffX < -threshold) showSlideVisuals(imageViewerCurrentIndex + 1); else updateSliderVisuals(imageViewerCurrentIndex); });
    slider.addEventListener('mousedown', (e) => e.preventDefault());

    viewerContainer.jumpToSlide = (index) => { if (index >= 0 && index < totalImages) showSlideVisuals(index); };
    showSlideVisuals(imageViewerCurrentIndex);
}


