<style>
    :global(:root) {
	
    --flatpickr-hijri-date-color: #3cc031;
      
    --flatpickr-hijri-date-selected: #f8d4b4;
      
  }
      
  :global(.flatpickr-hijri-month-name) {
      
    color: var(--flatpickr-hijri-date-color);
      
  }
      
  :global(.flatpickr-hijri-date-wrapper) {
      
    display: -webkit-box;
      
    display: -webkit-flex;
      
    display: -ms-flexbox;
      
    display: flex;
      
    -webkit-box-pack: space-evenly;
      
    -webkit-justify-content: space-evenly;
      
        -ms-flex-pack: space-evenly;
      
            justify-content: space-evenly;
      
    -webkit-box-orient: vertical;
      
    -webkit-box-direction: normal;
      
    -webkit-flex-direction: column;
      
        -ms-flex-direction: column;
      
            flex-direction: column;
      
    line-height: 0.9em;
      
    height: 100%;
      
  }
      
  :global(.flatpickr-hijri-date-hijri) {
      
  /*background-color: #80cbc4;*/
      
    font-size: 12px;
      
    color: var(--flatpickr-hijri-date-color);
      
  }
  :global(.flatpickr-disabled .flatpickr-hijri-date-hijri) {
      
        
    color: rgba(57,57,57,0.1);
    
}
      
  :global(.flatpickr-hijri-date-not-allowed) {
      
    color: rgba(57,57,57,0.1) !important;
      
  }
      
  :global(.flatpickr-hijri-date-selected) {
      
    color: var(--flatpickr-hijri-date-selected) !important;
      
  }
      
  :global(.flatpickr-hijri-actions) {
      
    height: 40px;
      
    max-height: 0px;
      
    visibility: hidden;
      
    display: -webkit-box;
      
    display: -webkit-flex;
      
    display: -ms-flexbox;
      
    display: flex;
      
    -webkit-box-pack: start;
      
    -webkit-justify-content: flex-start;
      
        -ms-flex-pack: start;
      
            justify-content: flex-start;
      
    -webkit-box-align: center;
      
    -webkit-align-items: center;
      
        -ms-flex-align: center;
      
            align-items: center;
      
    cursor: pointer;
      
    background: rgba(0,0,0,0.06);
      
    padding: 0 8px;
      
  }
      
  :global(.flatpickr-hijri-actions.darkTheme) {
      
    color: #fff;
      
    fill: #fff;
      
  }
      
  :global(.flatpickr-hijri-actions.visible) {
      
    max-height: 40px;
      
    visibility: visible;
      
  }
      
  :global(.flatpickr-hijri-switch) {
      
    position: relative;
      
    display: inline-block;
      
    width: 30px;
      
    height: 17px;
      
  }
      
  :global(.flatpickr-hijri-switch input) {
      
    opacity: 0;
      
    width: 0;
      
    height: 0;
      
  }
      
  :global(.flatpickr-hijri-switch) {
      
    margin-left: 8px;
      
  }
      
  :global(.flatpickr-hijri-slider) {
      
    position: absolute;
      
    cursor: pointer;
      
    top: 0;
      
    left: 0;
      
    right: 0;
      
    bottom: 0;
      
    background-color: #ccc;
      
    -webkit-transition: 0.4s;
      
    transition: 0.4s;
      
  }
      
  :global(.flatpickr-hijri-slider:before) {
      
    position: absolute;
      
    content: "";
      
    height: 13px;
      
    width: 13px;
      
    left: 2px;
      
    bottom: 2px;
      
    background-color: #fff;
      
    -webkit-transition: 0.4s;
      
    transition: 0.4s;
      
  }
      
  :global(:checked + .flatpickr-hijri-slider) {
      
    background-color: var(--flatpickr-hijri-date-color);
      
  }
      
  :global(:focus + .flatpickr-hijri-slider) {
      
    -webkit-box-shadow: 0 0 1px var(--flatpickr-hijri-date-color);
      
            box-shadow: 0 0 1px var(--flatpickr-hijri-date-color);
      
  }
      
  :global(:checked + .flatpickr-hijri-slider:before) {
      
    -webkit-transform: translateX(13px);
      
    -ms-transform: translateX(13px);
      
    transform: translateX(13px);
      
  }
</style>

