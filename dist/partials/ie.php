<!--[if lte IE 9]>
    <div class="message message--outdated" id="js-ieMessage">
        <p>
        You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/" target="_blank">upgrade your browser</a> to improve your experience.
        </p>
        <p>
        <button class="button" id="js-ieClose">Close</button>
        </p>
    </div>
    <script>
        var ieClose = document.getElementById('js-ieClose')
        var ieMessage = document.getElementById('js-ieMessage')
        function ieCLosMsg() { ieMessage.style.display = 'none' }
        ieClose.addEventListener('click', ieCLosMsg)
    </script>
<![endif]-->