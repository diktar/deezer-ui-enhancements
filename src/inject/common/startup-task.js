(() => {
    window.addStartupTask = function(task) {
        let originalFunc = document.onreadystatechange;

        document.onreadystatechange = () => {
            if(originalFunc != null) {
                originalFunc(arguments);
            }

            if (document.readyState === 'complete') {
                task(arguments);
            }
        };
    };
})()