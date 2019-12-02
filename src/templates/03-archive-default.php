<?php $bodyClass = 'archive'; ?>
<?php include 'partials/header.php'; ?>
    <?php includeWithVariables('partials/hero.php', array('heroTitle' => 'Archive Default', 'heroExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
    <div class="container">
        <h2>Archive list</h2>
        <div class="archive__list">
            <?php for ($i=1; $i < 6; $i++) { ?>
                <div class="archive__item">
                    <?php includeWithVariables('cards/cards.php', array('cardClass' => 'card card--row card--center', 'cardTitle' => 'Card Title', 'cardExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
                    <hr>
                </div>
            <?php } ?>
        </div>
    </div>
<?php include 'partials/footer.php'; ?>