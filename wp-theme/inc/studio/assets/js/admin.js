jQuery(document).ready(function($) {
    // Tab Navigation
    $('.studio-nav .nav-tab').on('click', function(e) {
        e.preventDefault();
        
        var tabId = $(this).data('tab');
        
        // Remove active class from all tabs and contents
        $('.studio-nav .nav-tab').removeClass('active');
        $('.studio-tab-content').removeClass('active');
        
        // Add active class to clicked tab and corresponding content
        $(this).addClass('active');
        $('#tab-' + tabId).addClass('active');
    });

    // Save Settings via AJAX
    $('#save-studio-settings').on('click', function() {
        var $btn = $(this);
        var $status = $('.save-status');
        
        // Gather form data
        var formData = $('#studio-form').serializeArray();
        var settings = {};
        
        // Process form data into structured object
        formData.forEach(function(item) {
            var name = item.name.replace(/\[(\w+)\]/g, '[$1]');
            
            // Handle array notation for repeaters
            if (name.indexOf('services[') !== -1 || name.indexOf('team[') !== -1) {
                var matches = name.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
                if (matches) {
                    var groupName = matches[1];
                    var index = parseInt(matches[2]);
                    var field = matches[3];
                    
                    if (!settings[groupName]) settings[groupName] = [];
                    if (!settings[groupName][index]) settings[groupName][index] = {};
                    settings[groupName][index][field] = item.value;
                }
            } else {
                settings[name] = item.value;
            }
        });

        $btn.prop('disabled', true).text('Saving...');
        
        $.ajax({
            url: studioConfig.ajaxUrl,
            type: 'POST',
            data: {
                action: 'studio_save_settings',
                nonce: studioConfig.nonce,
                settings: settings
            },
            success: function(response) {
                if (response.success) {
                    $status.text('Saved!').addClass('visible');
                    setTimeout(function() {
                        $status.removeClass('visible');
                    }, 2000);
                } else {
                    alert('Error saving settings');
                }
            },
            error: function() {
                alert('Error saving settings');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Save Changes');
            }
        });
    });

    // Add Service Repeater
    $('.add-service').on('click', function() {
        var index = $('#services-repeater .repeater-item').length;
        var html = `
            <div class="repeater-item">
                <span class="remove-item">&times;</span>
                <input type="text" name="${studioConfig.optionName}[services][${index}][title]" placeholder="Service Title" />
                <textarea name="${studioConfig.optionName}[services][${index}][description]" placeholder="Description"></textarea>
                <input type="text" name="${studioConfig.optionName}[services][${index}][icon]" placeholder="Icon Class" />
            </div>
        `;
        $('#services-repeater').append(html);
    });

    // Add Team Repeater
    $('.add-team').on('click', function() {
        var index = $('#team-repeater .repeater-item').length;
        var html = `
            <div class="repeater-item">
                <span class="remove-item">&times;</span>
                <input type="text" name="${studioConfig.optionName}[team][${index}][name]" placeholder="Name" />
                <input type="text" name="${studioConfig.optionName}[team][${index}][role]" placeholder="Role" />
                <input type="text" name="${studioConfig.optionName}[team][${index}][image]" placeholder="Image URL" />
            </div>
        `;
        $('#team-repeater').append(html);
    });

    // Remove Repeater Item
    $(document).on('click', '.remove-item', function() {
        $(this).closest('.repeater-item').remove();
    });
});
