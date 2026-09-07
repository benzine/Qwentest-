jQuery(document).ready(function($) {
    var studioActive = false;
    var currentElement = null;

    // Toggle Frontend Panel
    $('#studio-frontend-toggle').on('click', function() {
        studioActive = !studioActive;
        
        if (studioActive) {
            $('#studio-frontend-panel, #studio-overlay-backdrop').fadeIn(300);
            enableEditMode();
        } else {
            $('#studio-frontend-panel, #studio-overlay-backdrop').fadeOut(300);
            disableEditMode();
        }
    });

    // Close Panel
    $('#close-studio-panel, #studio-overlay-backdrop').on('click', function() {
        studioActive = false;
        $('#studio-frontend-panel, #studio-overlay-backdrop').fadeOut(300);
        disableEditMode();
    });

    function enableEditMode() {
        // Make text elements editable
        $('h1, h2, h3, h4, h5, h6, p, span, a, li, .btn, button').each(function() {
            var $el = $(this);
            if (!$el.closest('#studio-frontend-panel, #studio-frontend-toggle').length) {
                $el.addClass('studio-editable-hover');
            }
        });
    }

    function disableEditMode() {
        $('.studio-editable-hover, .studio-editing-active').removeClass('studio-editable-hover studio-editing-active');
        $('#frontend-editor-controls').hide();
        currentElement = null;
    }

    // Click to Edit
    $(document).on('click', '.studio-editable-hover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove active from previous
        $('.studio-editing-active').removeClass('studio-editing-active');
        
        // Set current element
        currentElement = $(this);
        currentElement.addClass('studio-editing-active');
        
        // Populate editor
        var content = currentElement.text().trim();
        $('#frontend-edit-area').val(content);
        $('#frontend-editor-controls').show();
    });

    // Save Frontend Edit
    $('#save-frontend-edit').on('click', function() {
        if (!currentElement) return;
        
        var newContent = $('#frontend-edit-area').val();
        var settingsKey = determineSettingsKey(currentElement);
        var newData = {};
        
        // Determine what to update based on element context
        if (settingsKey) {
            newData[settingsKey] = newContent;
            
            $.ajax({
                url: studioFrontConfig.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'studio_save_settings',
                    nonce: studioFrontConfig.nonce,
                    settings: newData
                },
                success: function(response) {
                    if (response.success) {
                        currentElement.text(newContent);
                        $('#frontend-editor-controls').hide();
                        currentElement.removeClass('studio-editing-active');
                        currentElement = null;
                    }
                }
            });
        } else {
            // Just update visually for now (non-persistent edit)
            currentElement.text(newContent);
            $('#frontend-editor-controls').hide();
            currentElement.removeClass('studio-editing-active');
            currentElement = null;
        }
    });

    function determineSettingsKey($el) {
        // Try to map element to settings field
        if ($el.closest('#hero').length || $el.hasClass('hero-title')) {
            if ($el.is('h1')) return 'hero_title';
            if ($el.is('p') || $el.hasClass('hero-subtitle')) return 'hero_subtitle';
            if ($el.hasClass('btn') || $el.is('button')) return 'hero_cta';
        }
        
        if ($el.closest('#contact').length) {
            if ($el.text().indexOf('@') !== -1) return 'contact_email';
            if ($el.text().indexOf('+') !== -1 || $el.text().match(/\d{3}/)) return 'contact_phone';
        }
        
        if ($el.closest('footer').length) {
            if ($el.text().indexOf('©') !== -1) return 'copyright';
        }
        
        return null;
    }

    // Prevent panel clicks from closing
    $('#studio-frontend-panel').on('click', function(e) {
        e.stopPropagation();
    });
});
