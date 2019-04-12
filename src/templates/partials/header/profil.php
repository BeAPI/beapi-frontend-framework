<div class="profil">
    <div class="profil__media">
        <?php echo get_the_post_thumbnail( 0, '', array( 'data-location' => 'profil-header', 'class' => 'entry__img', 'alt' => 'Img description' ) ); ?>
    </div>
    <div class="profil__name">
        Simon Bonnin
        <svg class="icon" aria-hidden="true" role="img">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-down"></use>
        </svg>
    </div>
    <ul class="profil__dropdown">
        <li>
            <a href="#">Se déconnecter</a>
        </li>
    </ul>
</div>