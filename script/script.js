const loadProjectDataJson = async () => {
    try {
        const response = await fetch('/website/json/projectData.json');
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.error('Error loading JSON file:', error);
    };
}

const loademojiListJson = async () => {
    try {
        const response = await fetch('/website/json/emojiList.json');
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.error('Error loading JSON file:', error);
    };
}

const closeModal = () => {
    $('body').on('click', '.close-button', () => {
        $('#modal').removeClass('active');
        setTimeout(() => {
            $('.popup').remove();
        }, 300);
    });
    $('.modal-background').on('click', (e) => {
        if (!e.target.closest('.popup')) {
            $('#modal').removeClass('active');
            setTimeout(() => {
                $('.popup').remove();
            }, 300);
        }
    });
};

const projectModalInit = () => {
    $('.project_images-item').click(function() {
        let projectName = $(this).data('project-name');
        if(projectName.length && projectData[projectName]) {
            createProjectModal(projectData[projectName]);
        }
    });
};

const createProjectModal = (project) => {
    let modalStructure = createModalStructure(project);
    $('#modal').append(modalStructure);
    setTimeout(() => {
        $('#modal').addClass('active');
    }, 1);
}

const createText = (text) => {
    if(text) {
        let listItems = '';
        text.forEach(i => {
            listItems += `<li>${i}</li>`
        });
        return listItems
    }
}

const createModalStructure = (modalData) => {
    let textSection = createText(modalData.text);
    return `
        <div class="popup">
            <div class="close-button"></div>
            <div class="image-row">
                <div class="project-image">
                    <img src="${modalData.image}" alt="${modalData.title}-img">
                </div>
            </div>
            <div class="content-row">
                <h4>${modalData.title}</h4>
                <span>${modalData.skills}</span>
                <ul>${textSection}</ul>
                <a href="${modalData.link}" target="_blank">view site</a>
            </div>
        </div>
    `
}

const emojiInit = () => {
    let shuffledEmojiList = emojiList.emojis;
    shuffleArray(shuffledEmojiList);
    typingAnimationInit(shuffledEmojiList);

}

const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const typingAnimationInit = (shuffledEmojiList) => {
    let index = 0;
    let emojiList = shuffledEmojiList;
    let typingInterval;
    
    const type = () => {
        let emoji = emojiList[index]
        let i = 0;
        typingInterval = setInterval(() => {
            let currentText = $('#emoji-type').text();
            $('#emoji-type').text(currentText + emoji.charAt(i));
            i++
            if (i == emoji.length) {
                clearInterval(typingInterval);
                let delay = 3000;
                startBlinkingCursor(delay);
                setTimeout(() => {
                    backspace()
                }, delay);
            }
        }, 200);
    }

    const backspace = () => {
        let emoji = emojiList[index]
        let i = emoji.length;
        typingInterval = setInterval(() => {
            let currentText = $('#emoji-type').text();
            $('#emoji-type').text(currentText.slice(0, -1));
            i--
            if (i == 0) {
                clearInterval(typingInterval);
                index = (index + 1) % emojiList.length;
                let delay = 1500;
                startBlinkingCursor(delay);
                setTimeout(() => {
                    type();
                }, delay);
            }
        }, 200);
    }

    const startBlinkingCursor = (delay) => {
        $('.emoji-cursor').addClass('blinking-cursor');
        setTimeout(() => {
            $('.emoji-cursor').removeClass('blinking-cursor');
        }, delay);
    }

    type();
}
  
const mobileNav = () => {
    $('.icon-wrapper').click(() => {
        $('#nav').toggleClass('is-open')
    });

    $('body').click((e) => {
        if(($(e.target).closest('#nav li a').length == 0) && ($(e.target).closest('.icon-wrapper').length == 0)){
            $('#nav').removeClass('is-open');
        };
    });
}

const fadeInAnimationInit = () => {

    const fadeAnimationSelectors = document.querySelectorAll(".fade-in-animation");

    const observerOptions = {
        root: null,
        rootMargin: "1px 0px 0px",
        threshold: 1
      };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, observerOptions);
    
    fadeAnimationSelectors.forEach((element) => observer.observe(element));

}

const pageSwipeAnimationInit = () => {
    $('.page-overlay').removeClass('covered');
    setTimeout(() => {
        emojiInit();
        fadeInAnimationInit();
    }, 800);
}

const projectData = await loadProjectDataJson();
const emojiList = await loademojiListJson();

$(document).ready(() => {
    closeModal();
    projectModalInit();
    mobileNav();
    pageSwipeAnimationInit();
})