!macro customInstall
   SetRegView 64
   WriteRegStr HKCR "*\shell\qiko" "" "在QikoNow中打开"
   WriteRegStr HKCR "*\shell\qiko" "Icon" "$INSTDIR\QikoNow.exe"
   WriteRegStr HKCR "*\shell\qiko\command" "" '"$INSTDIR\QikoNow.exe" "search" "%1"'
   WriteRegStr HKCR "*\shell\qiko_summary" "" "QikoNow 文档总结"
   WriteRegStr HKCR "*\shell\qiko_summary" "Icon" "$INSTDIR\QikoNow.exe"
   WriteRegStr HKCR "*\shell\qiko_summary\command" "" '"$INSTDIR\QikoNow.exe" "search" "%1" "cmd:qiko-system-chat|chat|文档总结"'
   WriteRegStr HKCR "qikonow" "" "URL:QikoNow Protocol"
   WriteRegStr HKCR "qikonow" "URL Protocol" ""
   WriteRegStr HKCR "qikonow\DefaultIcon" "" "$INSTDIR\QikoNow.exe"
   WriteRegStr HKCR "qikonow\shell" "" ""
   WriteRegStr HKCR "qikonow\shell\open" "" ""
   WriteRegStr HKCR "qikonow\shell\open\command" "" '"$INSTDIR\QikoNow.exe" "login" "%1"'
   SetRegView 32
   WriteRegStr HKCR "*\shell\qiko" "" "在QikoNow中打开"
   WriteRegStr HKCR "*\shell\qiko" "Icon" "$INSTDIR\QikoNow.exe"
   WriteRegStr HKCR "*\shell\qiko\command" "" '"$INSTDIR\QikoNow.exe" "search" "%1"'
   WriteRegStr HKCR "*\shell\qiko_summary" "" "QikoNow 文档总结"
   WriteRegStr HKCR "*\shell\qiko_summary" "Icon" "$INSTDIR\QikoNow.exe"
   WriteRegStr HKCR "*\shell\qiko_summary\command" "" '"$INSTDIR\QikoNow.exe" "search" "%1" "cmd:qiko-system-chat|chat|文档总结"'
   WriteRegStr HKCR "qikonow" "" "URL:QikoNow Protocol"
   WriteRegStr HKCR "qikonow" "URL Protocol" ""
   WriteRegStr HKCR "qikonow\DefaultIcon" "" "$INSTDIR\QikoNow.exe"
   WriteRegStr HKCR "qikonow\shell" "" ""
   WriteRegStr HKCR "qikonow\shell\open" "" ""
   WriteRegStr HKCR "qikonow\shell\open\command" "" '"$INSTDIR\QikoNow.exe" "login" "%1"'
!macroend
!macro customUninstall
   DeleteRegKey HKCR "*\shell\qiko"
   DeleteRegKey HKCR "*\shell\qikonow"
   DeleteRegKey HKCR "*\shell\qiko_summary"
!macroend