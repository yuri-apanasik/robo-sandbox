let viewer;
const modelUrn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdF8yMDIwMDUxNy9kb3duLnhfdA';

function ready() {
    const viewerContainer = document.getElementById('forgeViewerContainer');
    const heightDelta = 100;

    function checkViewerRatio() {
        const landscape = window.innerHeight + heightDelta < window.innerWidth;
        viewerContainer.style.paddingTop = landscape ? 0 : '100%';
        viewerContainer.style.height = landscape ? '500px' : 'auto';
    }
    checkViewerRatio();
    window.addEventListener('resize', checkViewerRatio);

    launchViewer(modelUrn);
}
document.addEventListener("DOMContentLoaded", ready);

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    Autodesk.Viewing.Private.InitParametersSetting.alpha = true;

    viewer = new Autodesk.Viewing.Viewer3D(document.getElementById('forgeViewer'), { extensions: [ 'Autodesk.DocumentBrowser'] });
    viewer.start();

    viewer.impl.renderer().setClearAlpha(0);
    viewer.impl.glrenderer().setClearColor(0xffffff, 0);
    viewer.impl.invalidate(true);

    var documentId = `urn:${urn}`;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables, {
    keepCurrentModels: true,
    applyRefPoint: true,
    globalOffset: { x: 0, y: 0, z: 0 }
  }).then(i => {
    // documented loaded, any action?
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}