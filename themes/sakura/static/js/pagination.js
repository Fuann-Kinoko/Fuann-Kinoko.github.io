// 检查 URL 是否存在
async function checkUrlExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    // 如果响应状态码是200，则认为URL存在
    return response.ok;
  } catch (error) {
    console.error('Error checking URL:', error);
    return false;
  }
}

// 更新 href，如果新地址存在
async function updateHref(e) {
  let url = new URL(e.target.href);
  let path = url.pathname;
  let parts = path.split('/');

  // 找到最后一个数字部分，并将其转化为整数
  let numberPart = parseInt(parts[parts.length - 2], 10);

  if (!isNaN(numberPart)) {
    numberPart += 1;

    parts[parts.length - 2] = numberPart;
    url.pathname = parts.join('/');

    const newUrl = url.href;
    if (await checkUrlExists(newUrl)) {
      // 更新 href
      e.target.href = newUrl;
    } else {
        e.target.textContent = 'You have reached the end';
        e.target.removeAttribute('href');
        e.target.classList.remove("nextpage");
    }
  }
}


document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', async function(e) {
        // Check if the clicked element is a '.nextpage' link
        if (e.target && e.target.matches('#pagination a.nextpage')) {
            console.log("have matched nextpage class");
            e.preventDefault(); // Block the link click from changing the page
            const nextPageUrl = e.target.href;

            try {
                // Perform a fetch request to load the next page
                const response = await fetch(nextPageUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'text/html' }
                });

                if (response.ok) {
                    const text = await response.text();
                    const currentContainer = document.getElementById('content');

                    // Create a temporary hidden element to attach the created document
                    const tempDiv = document.createElement('div');
                    tempDiv.style.display = 'none';
                    document.body.appendChild(tempDiv);
                    tempDiv.innerHTML = text;

                    // Find the new content container in the new document
                    const newContainer = tempDiv.querySelector('#content');
                    if (newContainer) {
                        currentContainer.parentNode.appendChild(newContainer);
                    }

                    // Remove the temporary element
                    document.body.removeChild(tempDiv);

                    // Update the URL bar
                    // if (window.history.pushState) {
                    //     window.history.pushState(null, null, nextPageUrl);
                    // }

                    // console.log("Successfully changed page to " + nextPageUrl);

                    await updateHref(e);
                } else {
                    console.error('Error loading page:', response.statusText);
                    window.location.href = nextPageUrl;
                }
            } catch (error) {
                console.error('Request failed, can\'t load more pages', error);
            }
        }
    });
});
