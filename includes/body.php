<canvas id="main" width="240" height="160"></canvas>
<div style="width: 360px; display: flex;">
  <div style="flex:1;">
    Selected Character: <span id="hero"></span>
  </div>

  <div style="flex:1;">
    isMoving: <span id="moving"></span>
  </div>
</div>
<br />
<div style="width: 360px; display: flex;">
  <div style="flex:1;">
    Selector X<input id="selector-x" type="text"></input>
    Selector Y<input id="selector-y" type="text"></input>
  </div>

  <div style="flex:1;">
    Selector Col<input id="selector-col" type="text"></input>
    Selector Row<input id="selector-row" type="text"></input>
  </div>
</div>

<canvas id="battle" width="240" height="160"></canvas>

<!-- <div style="width: 360px; display: flex;">
  <div style="flex:1;">
    <button onclick="playSprite2()" style="float: left;">Play 2</button>
    <button onclick="stopSprite2()" style="float: left;">Stop 2</button>
    <br />
    <button onclick="minusFrame('brigand')" style="float: left;">-1 Frame</button>
    <button onclick="plusFrame('brigand')" style="float: left;">+1 Frame</button>
  </div>

  <div style="flex:1;">
    <button onclick="playSprite()">Play</button>
    <button onclick="stopSprite()">Stop</button>
    <br />
    <button onclick="minusFrame('lyn')">-1 Frame</button>
    <button onclick="plusFrame('lyn')">+1 Frame</button>
  </div>

</div>

<div style="width: 360px; display: flex;">
  <div style="flex: 1; margin: 0; vertical-align: top; padding: 15px;">
    <h5>Current Frame: <span id="brigand-current-frame"></span></h5>
    <h5>X Offset: <input type="number" step="5" onchange="handleXOffsetChange(this, 'brigand')" onclick="handleXOffsetChange(this, 'brigand')" id="brigand-x-offset" value=""></h5>

    <h5>Y Offset: <input type="number" onchange="handleYOffsetChange(this, 'brigand')" onclick="handleYOffsetChange(this, 'brigand')" id="brigand-y-offset" value=""></h5>
  </div>

  <div style="flex: 1; margin: 0; vertical-align: top; padding: 15px;">
    <h5>Current Frame: <span id="lyn-current-frame"></span></h5>
    <h5>X Offset: <input type="number" step="5" onchange="handleXOffsetChange(this, 'lyn')" onclick="handleXOffsetChange(this, 'lyn')" id="lyn-x-offset" value=""></h5>

    <h5>Y Offset: <input type="number" onchange="handleYOffsetChange(this, 'lyn')" onclick="handleYOffsetChange(this, 'lyn')" id="lyn-y-offset" value=""></h5>
  </div>
</div> -->
