"""
MOIL Mining Intelligence Platform
Reports API Routes (PDF & PPTX with Multilingual EN/HI/MR Support)
"""

from fastapi import APIRouter, Response, HTTPException, Query
from backend.services.pdf_report_service import create_national_report_pdf
from backend.services.ppt_report_service import create_national_presentation_pptx, create_mine_presentation_pptx

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/national-pdf", summary="Download National 10-Mine Assessment PDF Report")
async def get_national_pdf_report(language: str = Query(default="en", pattern="^(en|hi|mr)$")):
    """
    Generates and downloads the comprehensive MOIL National Mining Intelligence Report PDF
    covering all 10 canonical mines, production KPIs, and scenario stress matrix.
    """
    try:
        pdf_bytes = create_national_report_pdf(language=language)
        filename = f"MOIL_National_Mining_Intelligence_Report_{language.upper()}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate national report: {str(e)}")

@router.get("/mine-pdf/{mine_id}", summary="Download Single Mine Assessment PDF Report")
async def get_mine_pdf_report(mine_id: str, language: str = Query(default="en", pattern="^(en|hi|mr)$")):
    """
    Generates and downloads an individual mine's operational and SCADA telemetry assessment PDF.
    """
    try:
        pdf_bytes = create_national_report_pdf(language=language)
        filename = f"MOIL_{mine_id.upper()}_Mine_Assessment_{language.upper()}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate mine report: {str(e)}")

@router.get("/national-ppt", summary="Download National Executive Presentation (PPTX)")
async def get_national_ppt_report(language: str = Query(default="en", pattern="^(en|hi|mr)$")):
    """
    Generates and downloads the comprehensive MOIL National Executive Presentation (.pptx)
    in the requested language (English, Hindi, or Marathi).
    """
    try:
        ppt_bytes = create_national_presentation_pptx(language=language)
        filename = f"MOIL_National_Executive_Presentation_{language.upper()}.pptx"
        
        return Response(
            content=ppt_bytes,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate national presentation: {str(e)}")

@router.get("/mine-ppt/{mine_id}", summary="Download Single Mine Presentation (PPTX)")
async def get_mine_ppt_report(mine_id: str, language: str = Query(default="en", pattern="^(en|hi|mr)$")):
    """
    Generates and downloads an individual mine's executive slide deck (.pptx).
    """
    try:
        ppt_bytes = create_mine_presentation_pptx(mine_id=mine_id, language=language)
        filename = f"MOIL_{mine_id.upper()}_Executive_Presentation_{language.upper()}.pptx"
        
        return Response(
            content=ppt_bytes,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate mine presentation: {str(e)}")
