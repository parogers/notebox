/* 
 * Author: Peter Rogers (peter.rogers@gmail.com)
 * License: GPLv3 (see LICENSE for details)
 */

function attachRemoveEvent(div)
{
    /* Attach a window signal handler, so when the user clicks outside the
     * div it automatically removes this popup.
     * Note: could use arguments.callee to avoid the named function... */
    function dismiss() {
	document.body.removeChild(div);
	window.removeEventListener("click", dismiss);
    }
    window.addEventListener("click", dismiss);
}

function showPopup(event, text) 
{
    var content = document.getElementById("primary");
    // Create a div which will act as our popup
    var div = document.createElement("div");
    div.className = "notebox_temp";
    div.innerHTML = text;
    // Chrome likes for the element to be part of the document, before 
    // window.getComputedStyle will work. (FF is okay)
    document.body.appendChild(div);

    // Figure out the box padding, so we know the final popup size. The div
    // is positioned with padding taken into account, but the size is given
    // without padding.
    var style = window.getComputedStyle(div);
    var leftPad = parseInt(style.paddingLeft);
    var rightPad = parseInt(style.paddingRight);
    var topPad = parseInt(style.paddingTop);
    var bottomPad = parseInt(style.paddingBottom);
    var width = parseInt(style.width);

    // Put the popup div roughly centered under the note (we handle page
    // scroll amounts below)
    var rect = event.target.getBoundingClientRect();
    var top = rect.bottom-1;
    var left = (rect.left+rect.right)/2 - (width+leftPad+rightPad)/2;

    // Make sure the note popup doesn't run out of the content area
    if (content) {
	var contentRect = content.getBoundingClientRect();
	// Shift the popup left/right
	if (left < contentRect.left) {
	    left = contentRect.left;
	} else if (left+width+leftPad+rightPad > contentRect.right) {
	    left = contentRect.right-width-leftPad-rightPad;
	}
    }

    var divRect = div.getBoundingClientRect();
    //console.log(divRect.bottom - divRect.top);

    // Now position the div
    console.log("SETTING LEFT " + left);
    div.style.top = top + window.pageYOffset;
    div.style.left = left + window.pageXOffset;

    console.log("PAD '" + window.getComputedStyle(div).paddingLeft + "'");

    window.setTimeout(function() {
	/* Shift the popup up if it drops below the bottom of the content
	 * area. We check here, because by now the height of the div should
	 * be calculated based on it's contents. */
	var divRect = div.getBoundingClientRect();
	if (contentRect && divRect.bottom > contentRect.bottom) 
	{
	    var top = rect.top - (divRect.bottom-divRect.top);
	    div.style.top = top + window.pageYOffset;
	}
	/* Attach the click-to-dismiss event here, outside of the original
	 * onclick event. This way, the original event won't accidentally
	 * trigger the dismiss handler. That could be avoided with a call
	 * to event.stopPropagation(), but then clicking on subsequent notes
	 * wouldn't dismiss already open notes. */
	attachRemoveEvent(div);
	// Starts the CSS transition to make the popup visible
	div.className = "notebox";
    }, 50);

    //event.stopPropagation();
}
