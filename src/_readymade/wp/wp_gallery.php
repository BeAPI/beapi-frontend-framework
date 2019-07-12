<?php
// You can manage up to 4 colomns using native WordPress galleries
$gallerycols = 4; ?>
<div class="gallery gallery-columns-<?php echo $gallerycols; ?> gallery-size-thumbnail">
    <?php for ($i=1; $i < 9; $i++) : ?>
        <figure class="gallery-item">
            <div class="gallery-icon">
                <a href="#" title="#"><img width="150" height="150" src="http://placehold.it/150x150" class="attachment-thumbnail" alt="#" title="#"></a>
            </div>
            <figcaption class="wp-caption-text gallery-caption">
            Caption text <?php echo $i; ?>
            </figcaption>
        </figure>
    <?php endfor; ?>
</div>