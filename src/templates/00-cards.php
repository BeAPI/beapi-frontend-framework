<?php $bodyClass = 'home'; ?>
<?php include 'partials/header.php'; ?>
	<article class="article">
		<div class="container">
            <h1>Cards</h1>

            <h2>Vertical</h2>
            <div style="max-width:300px;">
                <?php includeWithVariables('cards/cards.php', array('cardClass' => 'card', 'cardTitle' => 'Card Title', 'cardExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
                <hr>
                <?php includeWithVariables('cards/cards.php', array('cardClass' => 'card card--reverse', 'cardTitle' => 'Card Title', 'cardExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
                <hr>
            </div>
            <h2>Horizontal</h2>
            <?php includeWithVariables('cards/cards.php', array('cardClass' => 'card card--row', 'cardTitle' => 'Card Title', 'cardExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
            <hr>
            <?php includeWithVariables('cards/cards.php', array('cardClass' => 'card card--row card--reverse', 'cardTitle' => 'Card Title', 'cardExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
            <hr>
            <h2>Horizontal Centered</h2>
            <?php includeWithVariables('cards/cards.php', array('cardClass' => 'card card--row card--center', 'cardTitle' => 'Card Title', 'cardExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
            <hr>
            <?php includeWithVariables('cards/cards.php', array('cardClass' => 'card card--row card--center card--reverse', 'cardTitle' => 'Card Title', 'cardExcerpt' => 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod ex ad porro harum nemo assumenda enim nam, similique temporibus! Aliquid unde, reiciendis nesciunt asperiores veritatis tenetur eum! Omnis, neque natus.')); ?>
		</div>
	</article>

<?php include 'partials/footer.php'; ?>